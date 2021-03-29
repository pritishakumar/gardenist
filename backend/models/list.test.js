"use strict";
////////////////////////////////////////////////////////////
const { BadRequestError, NotFoundError } = require("../expressError");
const db = require("../db.js");
const List = require("./list");

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

beforeEach((async function() {
    await db.query(`BEGIN`);
}));

afterEach(async function() {
    await db.query("ROLLBACK");
});
afterAll(async function() {
    await db.end();
});

/**  */
describe("listNames functionality", function() {
    const email = "test@test.com";
    const email2 = "test1@test.com";
    const email3 = "test2@test.com";
    
    test("listNames works - lists have plants", async function() {
        const resp = await List.listNames(email);

        expect(resp).toEqual({
            [listId1]: {
                listName: "TestList1",
                plants: {
                    "123": "TestPlant"
                }
            },
            [listId2]: {
                listName: "TestList2",
                plants: {
                    "123": "TestPlant",
                    "456": "TestPlant2"
                }
            }
        });
    });
    test("listNames works - list empty", async function() {
        const resp = await List.listNames(email2);

        expect(resp).toEqual({
            [listId3]: {
                listName: "TestList3",
                plants: {}
            }
        });
    });
    test("listNames works - no lists", async function() {
        const resp = await List.listNames(email3);

        expect(resp).toEqual({});
    });
});

/**  */
describe("addList functionality", function() {
    const email = "test@test.com";
    const listName = "TestList4";
    const listNameExisting = "TestList1";
    
    test("addList works", async function() {
        const result = await List.addList(email, listName);

        expect(result).toEqual({
            list_id: expect.any(Number),
            list_name: listName
        });
    });
    test("addList Error - existing list", async function() {
        try {
            await List.addList(email, listNameExisting);
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
});

/**  */
describe("addPlant functionality", function() {
    const plantId = 789;
    const common = "TestPlant3"
    const plantIdExisting = 123;
    
    test("addPlant works", async function() {
        const result = await List.addPlant(listId1, plantId, common);

        expect(result).toEqual({
            list_id: listId1,
            plant_id: plantId,
            common
        });
    });
    test("addPlant Error - existing plant in list", async function() {
        try {
            await List.addPlant(listId1, plantIdExisting, common);
        } catch (err) {
            expect(err).toEqual(new BadRequestError("Plant already in list"))
        }
    });
    test("addPlant Error - missing data", async function() {
        try {
            await List.addPlant(listId1, plantId);
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
    test("addPlant Error - non-existent list", async function() {
        try {
            await List.addPlant("000", plantId, common);
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});

/**  */
describe("removePlant functionality", function() {
    const plantId = 123;
    const plantIdNon = 789;
    
    test("removePlant works", async function() {
        const result = await List.removePlant(listId1, plantId);
        
        expect(result).toEqual({
            list_id: listId1,
            plant_id: plantId
        });
    });
    test("removePlant works", async function() {
        try {
            const result = await List.removePlant(listId1, plantIdNon);
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
});
 
/**  */
describe("deleteList functionality", function() {
    const email = "test@test.com";

    test("deleteList works", async function() {
        const result = await List.deleteList(email, listId1);

        expect(result).toEqual({list_id: listId1});
    });
    test("deleteList Error - list not found", async function() {
        try {
            const result = await List.deleteList(email, "000");
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});