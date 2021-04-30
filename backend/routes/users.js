'use strict';

/** Routes for users. */

// const jsonschema = require("jsonschema");
const Joi = require('joi');
const express = require('express');
const { verifyToken } = require('../middleware/auth');
// const { BadRequestError } = require("../expressError");
const User = require('../models/user');
const List = require('../models/list');
const { createToken } = require('../helpers/token');
const { registerSchema, loginSchema } = require('../helpers/schemas');

const router = express.Router();

/** REGISTER NEW USER
 * POST /user/register:   
 * JSON Input: {email, name, password}
 * Returns: user(email, name), token(jwt-token)
 * 
 * Authorization required: none
 * 
 * Throws BadRequestError on email duplicates.
 **/
router.post('/register', async function(req, res, next) {
	try {
		const { email, name, password } = req.body;
		const validator = registerSchema.validate({ email, name, password });

		const newUser = await User.register(email, name, password);
		const token = createToken(newUser);
		return res.status(201).json({ user: newUser, token });
	} catch (err) {
		return next(err);
	}
});

/** USER LOGIN 
 * POST /user/login:  
 * JSON Input: {email, password}
 * Returns: user(email, name), token(jwt-token), lists
 *
 * Authorization required: none
 * 
 * Throws UnauthorizedError is user not found or wrong password.
 **/
router.post('/login', async function(req, res, next) {
	try {
		const { email, password } = req.body;
		const validator = loginSchema.validate({ email, password });

		const user = await User.login(email, password);
		const lists = await List.listNames(email);
		const token = createToken(user);
		return res.json({ user, token, lists });
	} catch (err) {
		return next(err);
	}
});

/** UPDATE USER INFORMATION
 * PATCH user/edit 
 * JSON Input: { email, password, formData }
 *  where formData = {email, name, password}
 * Returns: user(email, name), token
 *
 * Authorization required: same user Bearer Token
 * 
 * Throws BadRequestError if new email already exists or if invalid 
 * new entries given
 * Throws UnauthorizedError if wrong email or password
 **/
router.patch('/edit', verifyToken, async function(req, res, next) {
	try {
		const { email, password, formData } = req.body;
		const validator = registerSchema.validate({ email, password, formData });

		const user = await User.edit(email, password, formData);
		const token = createToken(user);
		return res.json({ user, token });
	} catch (err) {
		return next(err);
	}
});

/** DELETE USER ACCOUNT
 * DELETE user/delete
 * JSON Input: {email, password}
 * Returns: {deleted: email}
 *
 * Authorization required: same user Bearer Token
 * 
 * Throws UnauthorizedError if wrong password
 * Throws NotFoundError if user not found
 **/
router.delete('/delete', verifyToken, async function(req, res, next) {
	try {
		const { email, password } = req.body;
		await User.delete(email, password);
		return res.json({ deleted: email });
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
