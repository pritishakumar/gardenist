"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require("../config.js");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");
const sqlPartialUpdate = require('../helpers/partialUpdate');

class User {

    /** Register user with data.
     * Input: email, name, password
     * Returns: { name, email}
     *
     * Throws BadRequestError on duplicates.
     **/
    static async register(email, name, password) {
      const duplicateCheck = await db.query(
            `SELECT email
             FROM users
             WHERE email = $1`,
          [email],
      );
      if (duplicateCheck.rows[0]) {
        throw new BadRequestError(`Duplicate email: ${email}`);
      }
  
      const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
      const result = await db.query(
            `INSERT INTO users
             (email,
              name,
              password)
             VALUES ($1, $2, $3)
             RETURNING email, name `,
          [email, name, hashedPassword],
      );
      const user = result.rows[0];
      return user;
    }


    /** login user with email, password.
     * Input: email, password
     * Returns { email, name }
     *
     * Throws UnauthorizedError is user not found or wrong password.
     **/
     static async login(email, password) {
      const result = await db.query(
            `SELECT email, name, password
             FROM users
             WHERE email = $1`,
          [email],
      );
      const user = result.rows[0];

      if (user) {
        const isValid = await bcrypt.compare(password, user.password);
        if (isValid === true) {
          delete user.password;
          return user;
        }
      }
      throw new UnauthorizedError("Invalid email/password");
    }
  
    /** Update user information
     * Input: email, password, formData (containing name, password)
     * Returns user:{ email, name }, token
     *
     * Throws NotFoundError if user not found
     * Throws BadRequestError if new email already exists or if invalid 
     * new entries given
     * Throws UnauthorizedError if wrong password
     */
    static async edit(email, password, formData) {
      const isValid = await this.login(email, password)
      if (!isValid) {
        throw new UnauthorizedError("Invalid password");
      }

      const itemsToAdd = {...formData}
      if (formData.password) {
        const hashedNewPassword = await bcrypt.hash(formData.password, BCRYPT_WORK_FACTOR);
        itemsToAdd.password = hashedNewPassword;
      } else {
        delete itemsToAdd.password;
      }
      let { query, values } = sqlPartialUpdate(
        'users', 
        itemsToAdd,
        {key: "email",
          value: email},
        ["name", "password"],
        "email, name"
      );
      const result = await db.query(query, [...values]);
      const user = result.rows[0];
      if (!user) throw new NotFoundError(`No email: ${email}`);
          
      return user;
    }
  
    /** Delete user account
     * Input: email, password
     * 
     * Throws UnauthorizedError if wrong password
     * Throws NotFoundError if user not found
     */
    static async delete(email, password) {
      await this.login(email, password)
      let result = await db.query(
            `DELETE
             FROM users
             WHERE email = $1
             RETURNING email`,
          [email],
      );
      const user = result.rows[0];
      return user;
    }
  }
  
  
  module.exports = User;
  
