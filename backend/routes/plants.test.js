'use strict';

const request = require('supertest');

const db = require('../db.js');
const app = require('../app');
const Plant = require('../models/plant');
const {NotFoundError} = require("../expressError")

const axios = require('axios');
jest.mock('axios');

beforeAll(async function() {
	await db.query(`DELETE FROM plants`);
});
beforeEach(async function() {
	await db.query(`BEGIN`);
});
afterEach(async function() {
	await db.query('ROLLBACK');
});
afterAll(async function() {
	await db.end();
});

// /* GET /api/plants/search?q=query *******************  */
describe('GET /api/plants/search', function() {
    const { sabaNutSearchData, emptySearchData } = require("../models/plantMockData")

	test('search works', async function() {
        const axiosResp = {data: sabaNutSearchData}
        axios.get.mockResolvedValue(axiosResp);

        const url = `/api/plants/search?q=saba%20nut`
		const resp = await request(app).get(url);

		expect(resp.statusCode).toEqual(200);
		expect(resp.body.plants).toEqual([{
            id: 56220,
            common:  'Pachira Species, French Peanut, Guiana Chestnut, Malabar Chestnut, Money Tree, Saba Nut',
            imgs: ['https://davesgarden.com/guides/pf/thumbnail.php?image=2003/06/07/IslandJim/526a5c.jpg&width=163&height=163'],
            category: 'Edible Fruits and Nuts, Trees, Tropicals and Tender Perennials',
            height: '10-15 ft. | 3-4.7 m',
            location: 'Zone 9-11, Sun to Partial Shade, Light Shade'
        }]);
	});

	test('search Error empty', async function() {
        const axiosResp = {data: emptySearchData}
        axios.get.mockResolvedValue(axiosResp);

        const url = `/api/plants/search?q=xyz`
		const resp = await request(app).get(url);

		expect(resp.statusCode).toEqual(404);
	});
});

/* GET /api/plants/:id *******************  */
describe('GET /api/plants/:id', function() {
    const { sabaNutPage, nonExistPlant } = require("../models/plantMockData")

	test('get specific works, using api', async function() {
        const id = "56220" 
        const axiosResp = {data: sabaNutPage}
        axios.get.mockResolvedValue(axiosResp);

        const url = `/api/plants/${id}`
		const resp = await request(app).get(url);

		expect(resp.statusCode).toEqual(200);
		expect(resp.body).toEqual({ plant: {
            id: 56220,
            common:  'Pachira Species, French Peanut, Guiana Chestnut, Malabar Chestnut, Money Tree, Saba Nut',
            imgs: ["https://davesgarden.com/guides/pf/thumbnail.php?image=2005/03/23/palmbob/b6aaaa.jpg&widht=700&height=312", 
                    "https://pics.davesgarden.com/pics/2003/07/12/IslandJim/561de5_tn.jpg", 
                    "https://pics.davesgarden.com/pics/2003/08/16/OlgaN/73ac37_tn.jpg", 
                    "https://pics.davesgarden.com/pics/2003/06/07/IslandJim/526a5c_tn.jpg", 
                    "https://pics.davesgarden.com/pics/2003/09/21/IslandJim/72fb3c_tn.jpg"],
            Category: ["Edible Fruits and Nuts", "Trees", "Tropicals and Tender Perennials"],
            expiry: expect.any(String),
            Foliage: ["Evergreen"],
            Hardiness: ["USDA Zone 9b: to -3.8 °C (25 °F)", "USDA Zone 10a: to -1.1 °C (30 °F)", "USDA Zone 10b: to 1.7 °C (35 °F)", "USDA Zone 11: above 4.5 °C (40 °F)"],
            Height: ["10-12 ft. (3-3.6 m)", "12-15 ft. (3.6-4.7 m)"],
            location: ["Suitable for growing in containers"],
            Spacing: ["18-24 in. (45-60 cm)"],
            Sun: ["Sun to Partial Shade", "Light Shade"],
            Water: ["Average Water Needs;  Water regularly; do not overwater"],
            Propagation: ["From softwood cuttings", "From seed; direct sow outdoors in fall", "By air layering"],
            Bloom: ["This plant is attractive to bees, butterflies and/or birds"]
        }});
	});

	test('get specific Error empty', async function() {
        const id = "9999999"
        const axiosResp = {data: nonExistPlant}
        axios.get.mockResolvedValue(axiosResp);

        const url = `/api/plants/${id}`
		const resp = await request(app).get(url);

        expect(resp.body.error.message).toBe("Plant not found");
		expect(resp.statusCode).toBe(404);
	});
    test('get specific works, using db', async function() {
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

        const url = `/api/plants/${sabaNut.id}`
		const resp = await request(app).get(url);

        expect(resp.body).toEqual({ plant: {
            id: 56220,
            Bloom: ["This plant is attractive to bees, butterflies and/or birds"],
            Category: ["Edible Fruits and Nuts", "Trees", "Tropicals and Tender Perennials"],
            common: 'Pachira Species, French Peanut, Guiana Chestnut, Malabar Chestnut, Money Tree, Saba Nut',
            expiry: expect.any(String),
            Foliage: ["Evergreen"],
            Hardiness: ["USDA Zone 9b: to -3.8 °C (25 °F)", "USDA Zone 10a: to -1.1 °C (30 °F)", "USDA Zone 10b: to 1.7 °C (35 °F)", "USDA Zone 11: above 4.5 °C (40 °F)"],
            Height: ["10-12 ft. (3-3.6 m)", "12-15 ft. (3.6-4.7 m)"],
            imgs: ["https://davesgarden.com/guides/pf/thumbnail.php?image=2005/03/23/palmbob/b6aaaa.jpg&widht=700&height=312", 
            "https://pics.davesgarden.com/pics/2003/07/12/IslandJim/561de5_tn.jpg", 
            "https://pics.davesgarden.com/pics/2003/08/16/OlgaN/73ac37_tn.jpg", 
            "https://pics.davesgarden.com/pics/2003/06/07/IslandJim/526a5c_tn.jpg", 
            "https://pics.davesgarden.com/pics/2003/09/21/IslandJim/72fb3c_tn.jpg"
            ],
            location: ["Suitable for growing in containers"],
            Propagation: ["From softwood cuttings", "From seed; direct sow outdoors in fall", "By air layering"],
            Sun: ["Sun to Partial Shade", "Light Shade"],
            Spacing: ["18-24 in. (45-60 cm)"],
            Water: ["Average Water Needs;  Water regularly; do not overwater"],
            // ph: null,
            // seed: null,
            // toxicity: null
        }});
		expect(resp.statusCode).toBe(200);
	});
});