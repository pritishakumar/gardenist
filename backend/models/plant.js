"use strict";

const db = require("../db");
const axios = require("axios");
const {JSDOM} = require("jsdom")
const SEARCH_URL = "https://davesgarden.com/guides/pf/search/results.php?";
const PLANT_URL = "https://davesgarden.com/guides/pf/go"
const { scrapeSearch, scrapePlant } = require("../helpers/scrape");
const { insertPlantQuery } = require("../helpers/insertPlant")
const { NotFoundError } = require("../expressError");
const sqlForPartialUpdate = require("../helpers/partialUpdate")

class Plant {
    constructor(obj) {
        this.id = obj.id || null;
        this.expiry = obj.expiry || null;
        this.common = obj.common || null;
        this.imgs = obj.imgs || null;
        this.category = obj.category || null;
        this.water = obj.water || null;
        this.sun = obj.sun || null;
        this.ph = obj.ph || null;
        this.propagation = obj.propagation || null;
        this.height = obj.height || null;
        this.spacing = obj.spacing || null;
        this.hardiness = obj.hardiness || null;
        this.location = obj.location || null;
        this.toxicity = obj.toxicity || null;
        this.seed = obj.seed || null;
        this.foliage = obj.foliage || null;
        this.bloom = obj.bloom || null;
    }

    /** Search plant scraped source
     * Input: searchKeyWord, filters
     * Returns: [plantObjs]
     * where plantObjs = {id, common, imgs, category, height, location}
     *
     * Throws BadRequestError if no results found
     **/
    static async loadSearch(searchKeyWord, filters) {
        const url = `${SEARCH_URL}commo=${searchKeyWord}`
        const response = await axios.get(url);
        
        const dom = new JSDOM(response.data)

        if ( !!dom.window.document.querySelector(".plant-info-block h1") &&
            dom.window.document.querySelector(".plant-info-block h1").textContent == " No Results Found "
            ) {
            throw new NotFoundError("No results found");
        }

        const searchResults = Array.from(dom.window.document.querySelectorAll(".plant-info-block"));

        const plantList = scrapeSearch(searchResults);
        return plantList;
    }

    /** Load specific plant scraped source
         * Input: id
         * Returns: {plantObj}
         * where plantObj = {id, expiry, common, imgs, 
         *  category, water, sun, ph, propagation, height, 
         *  spacing, hardiness, location, toxicity, seed, 
         *  foliage, bloom}
         *
         * Throws BadRequestError if no plant found
         **/
    static async loadPlant(id) {
        const result = await db.query(
            `SELECT id, expiry, common, imgs, 
                category, water, sun, ph, 
                propagation, height, spacing, 
                hardiness, location, toxicity, 
                seed, foliage, bloom
             FROM plants
             WHERE id = $1`,
          [id],
        );
        let inDB = (!!result.rows[0]); // but expired information

        const url = `${PLANT_URL}/${id}`
        const response = await axios.get(url);
        const dom = await new JSDOM(response.data)
        if (
            dom.window.document.querySelector(".plants-files h1")
                    .textContent === "Not found"
            ) {
            throw new NotFoundError("Plant not found");
        }
        const plantData = dom.window.document.querySelector(".plants-files");
        
        const plantDetail = scrapePlant(id, plantData);

        plantDetail.expiry = new Date(new Date().getTime() + 30*24*60*60*1000);

        const keyArray = ["id", "expiry", "common", "imgs", 
        "Category", "Water", "Sun", "pH", 
        "Propagation", "Height", "Spacing", 
        "Hardiness", "location", "Toxicity", 
        "Seed", "Foliage", "Bloom"];
        
        if (inDB) {
            const {query, values} = sqlForPartialUpdate(
                "plants", 
                plantDetail, 
                {   key: "id",
                    value: id},
                keyArray,
                "id")

            const result = await db.query(query, values);
        } else {
            const {query, values} = insertPlantQuery(plantDetail)
            const result = await db.query(query, values);
        }
        return (plantDetail);
    }
}


module.exports = Plant;