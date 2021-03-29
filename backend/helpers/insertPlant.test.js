"use strict";

const { insertPlantQuery } = require("./insertPlant");

/**  */
describe("insertPlantQuery functionality", function() {
    test("insertPlantQuery works", function () {
        const sabaNut = {
            id: "56220",
            common: 'Pachira Species, French Peanut, Guiana Chestnut, Malabar Chestnut, Money Tree, Saba Nut',
            expiry: new Date(new Date().getTime() + 30*24*60*60*1000)
        }
        const queryString = `INSERT INTO plants
        (id, expiry, common, imgs,
        category, water, sun, ph,
        propagation, height,
        spacing, hardiness,
        location, toxicity, seed,
        foliage, bloom)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8,
        $9, $10, $11, $12, $13, $14, $15, $16,
        $17)
        RETURNING id`
        const valuesArray = [
            "56220",
            expect.any(Date),
            "Pachira Species, French Peanut, Guiana Chestnut, Malabar Chestnut, Money Tree, Saba Nut",
            undefined,undefined,
            undefined,undefined,undefined,
            undefined,undefined,undefined,
            undefined,undefined,undefined,
            undefined,undefined,undefined,
        ]
        const {query, values} = insertPlantQuery(sabaNut);

        expect(query).toEqual(queryString);
        expect(values).toEqual(valuesArray);
    });
});