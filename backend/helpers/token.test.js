"use strict";

const { createToken } = require("./token");
const jwt = require("jsonwebtoken");

/**  */
describe("createToken functionality", function() {
    test("create token works", function () {
        const user = {
            email: "test@test.com",
            name: "Test User"
        }
        const token = createToken(user);

        expect(token).toEqual(expect.any(String));
        expect(jwt.decode(token)).toEqual({
            email: "test@test.com", 
            iat: expect.any(Number), 
            name: "Test User"
        });
    })
});