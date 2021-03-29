"use strict";

const { BadRequestError,
    UnauthorizedError } = require("../expressError");
const db = require("../db.js");
const User = require("./user.js");


beforeAll((async function() {
    await db.query(`DELETE FROM users`);
    await db.query(
        `INSERT INTO users (email, name, password)
        VALUES ('test@test.com',
                'Test User',
                '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q'),
            ('test1@test.com',
                'Test User1',
                'not password')`
    );
}))

beforeEach((async function() {
    await db.query(`BEGIN`);
}))

afterEach(async function() {
    await db.query("ROLLBACK");
})
afterAll(async function() {
    await db.end();
})

/** register */
describe("register functionality", function() {
    const email = "test3@test.com";
    const emailDuplicate = "test@test.com";
    const name = "New User";
    const password = "password";

    test("register works", async function() { 
        const user = await User.register(email, name, password);
        expect(user).toEqual({name, email});
    })

    test("duplicate email", async function() {
        try {
            await User.register(emailDuplicate, name, password)
        } catch (err) {
            expect(err).toEqual(new BadRequestError(`Duplicate email: ${emailDuplicate}`));
        }
    })
})

/** log in */
describe("login", function () {
    const email = "test@test.com";
    const emailWrong = "test2@test.com";
    const password = "password";
    const passwordWrong = "password!!";

    test("login works", async function() {
        const user = await User.login(email, password);
        expect(user).toEqual({name: "Test User", email});
    })
    test("login incorrect password - Error", async function() {
        try {
            await User.login(email, passwordWrong);
        } catch (err) {
            expect(err).toEqual(new UnauthorizedError(`Invalid email/password`));
        }
    })
    test("login incorrect email - Error", async function() {
        try {
            await User.login(emailWrong, password);
        } catch (err) {
            expect(err).toEqual(new UnauthorizedError(`Invalid email/password`));
        }
    })
})

/** edit user profile */
describe("edit", function () {
    const email = "test@test.com";
    const name = "New User";
    const nameNew = "NewUser";
    const password = "password";
    const passwordNew = "password!!";

    test("edit user works, new name and password", async function () {
        const user = await User.edit(email, password, {name:nameNew, password:passwordNew});
        expect(user).toEqual({name: nameNew, email});
    })
    test("edit user Error, wrong password", async function () {
        try {
            await User.edit(email, passwordNew, {name, password:passwordNew});
        } catch (err) {
            expect(err).toEqual(new UnauthorizedError(`Invalid email/password`));
        }
    })
})

describe("delete", function() {
    const email = "test@test.com";
    const emailUnauth = "test1@test.com";
    const password = "password";
    const passwordWrong = "password!!";

    test("delete user works", async function() {
        const user = await User.delete(email, password);
        expect(user).toEqual({email})
    })
    test("delete user Error, unauthorized email", async function() {
        try {
            await User.delete(emailUnauth, password);
        } catch (err) {
            expect(err).toEqual(new UnauthorizedError(`Invalid email/password`));
        }
    })
    test("delete user Error, wrong password", async function () {
        try {
            await User.delete(email, passwordWrong);
        } catch (err) {
            expect(err).toEqual(new UnauthorizedError(`Invalid email/password`));
        }
    })
})
