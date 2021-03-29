"use strict";
////////////////////////////////////////////////////////////
const { NotFoundError } = require("../expressError");
const db = require("../db.js");
const Plant = require("./plant");
const axios = require('axios');
jest.mock('axios');


beforeAll(async function() {
    await db.query(`DELETE FROM plants`);
});

beforeEach((async function() {
    await db.query(`BEGIN`);
}));

afterEach(async function() {
    await db.query("ROLLBACK");
});
afterAll(async function() {
    await db.end();
});

/** search by keyword */
describe("loadSearch functionality", function() {
    const { sabaNutSearchData, emptySearchData } = require("./plantMockData")
    
    test("loadSearch works", async function() { 
        const axiosResp = {data: sabaNutSearchData}
        const searchKeyword = "saba%20nut";
        const sabaNut = {
            common:  'Pachira Species, French Peanut, Guiana Chestnut, Malabar Chestnut, Money Tree, Saba Nut',
            imgs: ['https://davesgarden.com/guides/pf/thumbnail.php?image=2003/06/07/IslandJim/526a5c.jpg&width=163&height=163'],
            Category: 'Edible Fruits and Nuts, Trees, Tropicals and Tender Perennials',
            Height: '10-15 ft. | 3-4.7 m',
            location: 'Zone 9-11, Sun to Partial Shade, Light Shade'
        }
        axios.get.mockResolvedValue(axiosResp);
        const result = await Plant.loadSearch(searchKeyword);

        expect(result).toEqual([{
            id: 56220,
            common: sabaNut.common,
            imgs: sabaNut.imgs,
            category: sabaNut.Category,
            height: sabaNut.Height,
            location: sabaNut.location
        }
        ]);
    })
    test("loadSearch Error empty", async function() { 
        const axiosResp = {data: emptySearchData}
        const searchKeyword = "xyz";
        try {
            axios.get.mockResolvedValue(axiosResp);
            const result = await Plant.loadSearch(searchKeyword);
        } catch (err) {
            expect(err).toEqual(new NotFoundError(`No results found`));
        }
    })
})

/** load specific plant */
describe("loadPlant functionality", function() {
    const { sabaNutPage, nonExistPlant } = require("./plantMockData")
    
    test("loadPlant works", async function() {
        const id = "56220" 
        const axiosResp = {data: sabaNutPage}
        axios.get.mockResolvedValue(axiosResp);
        const result = await Plant.loadPlant(id);

        expect(result).toEqual({
            id: expect.any(Number),
            Bloom: ["This plant is attractive to bees, butterflies and/or birds"],
            Category: ["Edible Fruits and Nuts","Trees","Tropicals and Tender Perennials"],
            common:  `Pachira Species, French Peanut, Guiana Chestnut, Malabar Chestnut, Money Tree, Saba Nut` ,
            expiry: expect.any(Date),
            Foliage:  ["Evergreen"],
            Hardiness:  ["USDA Zone 9b: to -3.8 °C (25 °F)","USDA Zone 10a: to -1.1 °C (30 °F)","USDA Zone 10b: to 1.7 °C (35 °F)","USDA Zone 11: above 4.5 °C (40 °F)"] ,
            Height:  ["10-12 ft. (3-3.6 m)","12-15 ft. (3.6-4.7 m)"] ,
            imgs:  ["https://davesgarden.com/guides/pf/thumbnail.php?image=2005/03/23/palmbob/b6aaaa.jpg&widht=700&height=312",
                "https://pics.davesgarden.com/pics/2003/07/12/IslandJim/561de5_tn.jpg",
                "https://pics.davesgarden.com/pics/2003/08/16/OlgaN/73ac37_tn.jpg",
                "https://pics.davesgarden.com/pics/2003/06/07/IslandJim/526a5c_tn.jpg",
                "https://pics.davesgarden.com/pics/2003/09/21/IslandJim/72fb3c_tn.jpg"
            ],
            location:  ["Suitable for growing in containers"] ,
            Propagation:  ["From softwood cuttings","From seed; direct sow outdoors in fall","By air layering"] ,
            Sun:  ["Sun to Partial Shade","Light Shade"] ,
            Spacing: ["18-24 in. (45-60 cm)"],
            Water:  ["Average Water Needs;  Water regularly; do not overwater"]
        });
    });
    test("loadPlant Error non-existent plant", async function() {
        const id = "9999999" 
        const axiosResp = {data: nonExistPlant}

        try {
            axios.get.mockResolvedValue(axiosResp);
            const result = await Plant.loadPlant(id);
        } catch (err) {
            expect(err).toEqual(new NotFoundError(`Plant not found`));
        }
    });
    test("loadPlant works, using db", async function() {
        const sabaNut = {
            id: "56220",
            common: 'Pachira Species, French Peanut, Guiana Chestnut, Malabar Chestnut, Money Tree, Saba Nut',
            expiry: new Date(new Date().getTime() + 30*24*60*60*1000)
        }
        await db.query(
            `INSERT INTO plants (id, common, expiry)
            VALUES ($1, $2, $3)`,
            [sabaNut.id, sabaNut.common, sabaNut.expiry]
        );
        
        const axiosResp = {data: sabaNutPage}
        axios.get.mockResolvedValue(axiosResp);
        const result = await Plant.loadPlant(sabaNut.id);

        expect(result).toEqual({
            id: 56220,
            Bloom: ["This plant is attractive to bees, butterflies and/or birds"],
            Category: ["Edible Fruits and Nuts","Trees","Tropicals and Tender Perennials"],
            common: 'Pachira Species, French Peanut, Guiana Chestnut, Malabar Chestnut, Money Tree, Saba Nut',
            expiry: expect.any(Date),
            Foliage: ["Evergreen"],
            Hardiness: ["USDA Zone 9b: to -3.8 °C (25 °F)","USDA Zone 10a: to -1.1 °C (30 °F)","USDA Zone 10b: to 1.7 °C (35 °F)","USDA Zone 11: above 4.5 °C (40 °F)"],
            Height: ["10-12 ft. (3-3.6 m)","12-15 ft. (3.6-4.7 m)"],
            imgs: ["https://davesgarden.com/guides/pf/thumbnail.php?image=2005/03/23/palmbob/b6aaaa.jpg&widht=700&height=312",
            "https://pics.davesgarden.com/pics/2003/07/12/IslandJim/561de5_tn.jpg",
            "https://pics.davesgarden.com/pics/2003/08/16/OlgaN/73ac37_tn.jpg",
            "https://pics.davesgarden.com/pics/2003/06/07/IslandJim/526a5c_tn.jpg",
            "https://pics.davesgarden.com/pics/2003/09/21/IslandJim/72fb3c_tn.jpg"
            ],
            location: ["Suitable for growing in containers"],
            Propagation: ["From softwood cuttings","From seed; direct sow outdoors in fall","By air layering"],
            Sun: ["Sun to Partial Shade","Light Shade"],
            Spacing: ["18-24 in. (45-60 cm)"],
            Water: ["Average Water Needs;  Water regularly; do not overwater"],
            // pH: null,
            // Seed: null,
            // Toxicity: null
        });
    });
});