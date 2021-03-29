"use strict";

const db = require("../db");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");
const axios = require("axios");
// const SEARCH_URL = "https://davesgarden.com/guides/pf/search/results.php?";
const PLANT_URL = "https://davesgarden.com/guides/pf/go"
const { scrapeSearch, scrapePlant } = require("../helpers/scrape");
const { insertPlantQuery } = require("../helpers/insertPlant")

class List {

    /** Retrive brief list information for the user
     * Input: email
     * Returns: {list, ..., list} or null if no lists
     * where list = { listName, [plantObj,.., plantObj] }
     * where plantObj = {plant_id, common}
     *
     **/
    static async listNames(email) {
        const userLists = await db.query(
            `SELECT li.list_id, li.list_name, 
                lc.plant_id, lc.common
            FROM lists li
            LEFT JOIN list_contents lc
                ON li.list_id = lc.list_id
            WHERE li.email = $1`,
          [email],
        );
        
        if (!userLists.rows) {
            return null;
        }

        const result = {};
        userLists.rows.forEach(each => {
            if (!result[each.list_id]) {
                result[each.list_id] = {
                    listName: each.list_name,
                    plants: {}
                }
            }
            if (each.plant_id) {
                result[each.list_id].plants[each.plant_id] = each.common;
            }
        })
        return result;
    }

    /** Adds a new list
     * Input: email, listId, listName
     * Returns: {list_id, list_name}
     *
     * Throws BadRequestError if list already exists
     **/
    static async addList(email, listName) {
        const checkExisting = await db.query(
            `SELECT email, list_name
            FROM lists
            WHERE list_name = $1 AND email = $2`,
            [listName, email]
        );

        if (checkExisting.rows.length) {
            throw new BadRequestError("List already exists")
        }
        const newList = await db.query(
            `INSERT INTO lists
            (email, list_name)
            VALUES ($1, $2)
            RETURNING list_id, list_name`,
            [email, listName]
        );
        return newList.rows[0];
     }

    
    /** Adds plant onto an existing list
     * Input: listId, plantId, common
     * Returns: {list_id, plant_id, common}
     *
     * Throws BadRequestError if: 
     *  - plant already in list
     *  - missing data 
     * Throws NotFoundError if list not found
     **/
     static async addPlant(listId, plantId, common) {
        if (!listId || !plantId || !common) {
            throw new BadRequestError("Missing input data")
        }

        const checkExisting = await db.query(
            `SELECT plant_id
            FROM list_contents 
            WHERE list_id = $1`,
            [listId]
        );
        const existingPlant = checkExisting.rows.filter(each => {
            return each["plant_id"] == plantId});
        let result;
        if (!existingPlant.length) {
            try {
                result = await db.query(
                    `INSERT INTO list_contents
                    (list_id, plant_id, common)
                    VALUES ($1, $2, $3)
                    RETURNING list_id, plant_id, common`,
                    [listId, plantId, common]
                )
            } catch (err) {
                throw new NotFoundError("List not found")
            }
              
        } else {
            throw new BadRequestError("Plant already in list")
        }
        return result.rows[0];
     }

    
    /** Removes a plant from a user's list
     * Input: listId, plantId
     * Returns: {list_id, plant_id}
     *
     * Throw BadRequestError if plant not found
     **/
    static async removePlant (listId, plantId) {
        const result = await db.query(
            `DELETE
            FROM list_contents
            WHERE list_id = $1 AND plant_id = $2
            RETURNING list_id, plant_id`,
            [listId, plantId]
        );
        if (!result.rows.length) {
            throw new BadRequestError("Entry not found")
        }
        return result.rows[0];
    }

    /** Deletes a user's list
     * Input: email, listId
     * Returns: {listId}
     *
     * Throw NotFoundError if list not found
     **/
     static async deleteList (email, listId) {
        const result = await db.query(
            `DELETE
            FROM lists
            WHERE list_id = $1 AND email = $2
            RETURNING list_id`,
            [listId, email]
        );
        if (!result.rows.length) {
            throw new NotFoundError("List not found")
        }
        return result.rows[0];
    }
}

module.exports = List;