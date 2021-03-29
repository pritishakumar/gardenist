'use strict';

const request = require('supertest');

const db = require('../db.js');
const app = require('../app');
const List = require('../models/list');
const {NotFoundError} = require("../expressError")

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJuYW1lIjoiVGVzdCBVc2VyIiwiaWF0IjoxNjE2NDUwMDc3fQ.11KGzWWRbzah6Sxgu_oHihgiEDBG7tTuErWL5sAF3xg";
let listId1, listId2, listId3;
beforeAll(async function() {
	await db.query(`DELETE FROM list_contents`);
    await db.query(`DELETE FROM lists`);
    await db.query(`DELETE FROM users`);
    
    
    await db.query(
        `INSERT INTO users (email, name, password)
        VALUES ('test@test.com',
                'Test User',
                '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q'),
                ('test1@test.com',
                'Test User1',
                'password'),
                ('test2@test.com',
                'Test User1',
                'password')
                `);
    const results = await db.query(
        `INSERT INTO lists (email, list_name)
        VALUES ('test@test.com', 'TestList1'),
            ('test@test.com', 'TestList2'),
            ('test1@test.com', 'TestList3')
        RETURNING list_id`
    );
    listId1 = results.rows[0].list_id;
    listId2 = results.rows[1].list_id;
    listId3 = results.rows[2].list_id;

    await db.query(
        `INSERT INTO list_contents (list_id, plant_id, common)
        VALUES ($1, 123, 'TestPlant'),
            ($2, 123, 'TestPlant'),
            ($2, 456, 'TestPlant2')`,
        [listId1, listId2]
    );
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

/* POST /api/lists/new *******************  */
describe('POST /api/lists/new', function() {
    const email = "test@test.com";
    const listName = "TestList4"
    const listNameExisting = "TestList1"

	test('new list works', async function() {
        
        const url = `/api/lists/new`
		const resp = await request(app).post(url)
            .send({
                listName
            })
            .set('authorization', `Bearer ${token}`);

		
		expect(resp.body).toEqual({list: {
            list_id: expect.any(Number), 
            list_name: listName}});
        expect(resp.statusCode).toEqual(200);
    });
    test('new list Error - list already exists', async function() {
        
        const url = `/api/lists/new`
		const resp = await request(app).post(url)
            .send({
                listName: listNameExisting
            })
            .set('authorization', `Bearer ${token}`);

		expect(resp.statusCode).toEqual(400);
		expect(resp.body.error.message).toBe("List already exists");
    });
    test('new list Error - unauth', async function() {
        
        const url = `/api/lists/new`
		const resp = await request(app).post(url)
            .send({
                listName
            });

		expect(resp.statusCode).toEqual(401);
		expect(resp.body.error.message).toBe("Proper token needed");
    });
});

/* POST /api/lists/:listId/:plantId *******************  */
describe('POST /api/lists/:listId/:plantId', function() {
    const plantId = 456;
    const plantIdExisting = 123;
    const common = "TestPlant2";
    const commonExisting = "TestPlant1";

    test('add plant to list works', async function() {
        const url = `/api/lists/${listId1}/${plantId}`
        const resp = await request(app).post(url)
            .send({
                common
            })
            .set('authorization', `Bearer ${token}`);

        expect(resp.body).toEqual({list: {
            common: common,
            list_id: listId1,
            plant_id: plantId
            }});
        expect(resp.statusCode).toEqual(200);
    });
    test('add plant to list Error - missing data', async function() {
        const url = `/api/lists/${listId1}/${plantId}`
        const resp = await request(app).post(url)
            .set('authorization', `Bearer ${token}`);

        expect(resp.body.error.message).toBe("Missing input data");
        expect(resp.statusCode).toBe(400);
    });
    test('add plant to list Error - existing plant in list', async function() {
        const url = `/api/lists/${listId1}/${plantIdExisting}`
        const resp = await request(app).post(url)
            .send({
                common: commonExisting
            })
            .set('authorization', `Bearer ${token}`);

        expect(resp.body.error.message).toEqual("Plant already in list");
        expect(resp.statusCode).toBe(400);
    });
    test('add plant to list Error - list not found', async function() {
        const url = `/api/lists/0000/${plantId}`
        const resp = await request(app).post(url)
            .send({
                common
            })
            .set('authorization', `Bearer ${token}`);

        expect(resp.body.error.message).toEqual("List not found");
        expect(resp.statusCode).toBe(404);
    });
    test('add plant to list Error - unauth', async function() {
        const url = `/api/lists/${listId1}/${plantId}`
        const resp = await request(app).post(url)
            .send({
                common
            });

            expect(resp.body.error.message).toEqual("Proper token needed");
            expect(resp.statusCode).toBe(401);
    });
});

/* DELETE /api/lists/:listId/plantId *******************  */
describe('DELETE /api/lists/:listId/plantId', function() {
    const plantIdNon = 789;
    const plantId = 123;
    const common = "TestPlant1";

    test('delete plant from list works', async function() {
        const url = `/api/lists/${listId1}/${plantId}`
        const resp = await request(app).delete(url)
            .set('authorization', `Bearer ${token}`);

        expect(resp.body).toEqual({list: {
            list_id: listId1, 
            plant_id: plantId
        }});
        expect(resp.statusCode).toEqual(200);
    });
    test('delete plant from list Error - non-existent plant', async function() {
        const url = `/api/lists/${listId1}/${plantIdNon}`
        const resp = await request(app).delete(url)
            .set('authorization', `Bearer ${token}`);

        expect(resp.body.error.message).toBe("Entry not found");
        expect(resp.statusCode).toBe(400);
    });
    test('delete plant from list Error - non-existent list', async function() {
        const url = `/api/lists/0000/${plantId}`
        const resp = await request(app).delete(url)
            .set('authorization', `Bearer ${token}`);

        expect(resp.body.error.message).toBe("Entry not found");
        expect(resp.statusCode).toBe(400);
    });
    test('delete plant from list Error - unauth', async function() {
        const url = `/api/lists/${listId1}/${plantIdNon}`
        const resp = await request(app).delete(url);

        expect(resp.body.error.message).toEqual("Proper token needed");
        expect(resp.statusCode).toBe(401);
    });
});

/* DELETE /api/lists/:listId *******************  */
describe('DELETE /api/lists/:listId', function() {
    test('delete specific list works', async function() {
        const url = `/api/lists/${listId1}`
        const resp = await request(app).delete(url)
            .set('authorization', `Bearer ${token}`);

        expect(resp.body).toEqual({list: {
            list_id: listId1
            }});
        expect(resp.statusCode).toEqual(200);
    });
    test('delete specific list Error - non-existent list', async function() {
        const url = `/api/lists/000`
        const resp = await request(app).delete(url)
            .set('authorization', `Bearer ${token}`);

        expect(resp.body.error.message).toEqual("List not found");
        expect(resp.statusCode).toBe(404);
    });
    test('delete specific list Error - unauth', async function() {
        const url = `/api/lists/${listId1}`
        const resp = await request(app).delete(url);

        expect(resp.body.error.message).toEqual("Proper token needed");
        expect(resp.statusCode).toBe(401);
    });
    
});