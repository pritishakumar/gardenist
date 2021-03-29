"use strict";

const sqlForPartialUpdate = require("./partialUpdate");

/**  */
describe("sqlForPartialUpdate functionality", function() {
    test("sqlForPartialUpdate works", function () {
        const table = "users"
        const items = {
            email: "test@test.com",
            name: "Test User"
        };
        const searchKey = {
            key: "email",
            value: "test@test.com"
        }
        const keyArray = ["email", "name", "password"]
        const returnVal = "email, name"

        const result = sqlForPartialUpdate(table, items, searchKey, keyArray, returnVal)
        
        expect(result).toEqual({
            query: "UPDATE users SET email=$1, name=$2 WHERE email=$3 RETURNING email, name", 
            values: ["test@test.com", "Test User", "test@test.com"]
        });
    })
});