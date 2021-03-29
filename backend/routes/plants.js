"use strict";

/** Routes for users. */

// const jsonschema = require("jsonschema");
const Joi = require("joi");
const express = require("express");
// const { BadRequestError } = require("../expressError");
const Plant = require("../models/plant");
const { querySchema, plantIDSchema } = require("../helpers/schemas");
const { NotFoundError } = require("../expressError");

const router = express.Router();


/** GET /api/plants/search
 * Query String Input: (q)
 *  where q is a query param name, spaces replaced with %20
 * Returns: [plantObjs]
 * 
 * Authorization required: none
 **/
router.get("/search", async function (req, res, next) {
    try {
        const searchTerm = req.query.q;
        const validator = querySchema.validate({searchTerm})
        
        const plants = await Plant.loadSearch(searchTerm);
        return res.status(200).json({ plants });
    } catch (err) {
        next(err);
    }
});


/** GET /api/plants/:id
 * URL Input: id
 * Returns: {plantObj}
 * 
 * Authorization required: none
 **/
 router.get("/:id", async function (req, res, next) {
    try {
        const id = req.params.id;
        const validator = plantIDSchema.validate({id})
        
        const plant = await Plant.loadPlant(req.params.id);
        return res.status(200).json({ plant });
    } catch (err) {
        next(err);
    }
});


module.exports = router;