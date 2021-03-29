"use strict";

/** Routes for lists. */


const joi = require("joi");
const express = require("express");
const { verifyToken } = require("../middleware/auth");
// const { BadRequestError } = require("../expressError");
const List = require("../models/list");
const { listSchema } = require("../helpers/schemas")

const router = express.Router();


/** POST /lists/new:   
 * JSON Input: listName
 * Returns: {list: {list_id, list_name}}
 * 
 * Authorization required: user Bearer Token
 * 
 * Throws BadRequestError if list already exists
 **/
router.post("/new", verifyToken, async function (req, res, next) {
    try {
        const { listName } = req.body;
        const email = res.locals.user.email;
        const validator = listSchema.validate({email, listName})
        const result = await List.addList(email, listName);
        return res.status(200).json({ list: result });
    } catch (err) {
        return next(err);
      }
});


/** Add specific plant to a list 
 * POST /lists/:listId/:plantId:   
 * URL String Input: listId, plantId
 * JSON Input: common
 * Returns: {list: {list_id, plant_id, common}
 * 
 * Authorization required: user Bearer Token
 * 
 * Throws BadRequestError if missing input data or plant
 *  already in list
 * Throws NotFoundError if list not found
 **/
 router.post("/:listId/:plantId", verifyToken, async function (req, res, next) {
    try {
        const listId = req.params.listId;
        const plantId = req.params.plantId;
        const { common } = req.body;
        const result = await List.addPlant(listId, plantId, common);
        // const lists = await List.listNames(email);
        return res.status(200).json({ list: result });
    } catch (err) {
        return next(err);
      }
});

/** Remove specific plant from a list 
 * DELETE /lists/:listId/plantId:   
 * URL String Input: listId, plantId
 * Returns: {list: {list_id, plant_id}}
 * 
 * Authorization required: user Bearer Token
 * 
 * Throws BadRequestError if plant not found
 **/
 router.delete("/:listId/:plantId", verifyToken, async function (req, res, next) {
    try {
        const listId = req.params.listId;
        const plantId = req.params.plantId;
        const { email } = res.locals.user;
        const result = await List.removePlant(listId, plantId);
        // const lists = await List.listNames(email);
        return res.status(200).json({ list: result });
    } catch (err) {
        return next(err);
      }
});


/** Delete a specific list 
 * DELETE /lists/:listId:   
 * URL String Input: listId
 * Returns: {list : {list_id}}
 * 
 * Authorization required: user Bearer Token
 * 
 * Throws BadRequestError if list not found
 **/
 router.delete("/:listId", verifyToken, async function (req, res, next) {
    try {
        const listId = req.params.listId;
        const { email } = res.locals.user;
        const result = await List.deleteList(email, listId);
        // const lists = await List.listNames(email);
        return res.status(200).json({ list: result });
    } catch (err) {
        return next(err);
      }
});

module.exports = router;