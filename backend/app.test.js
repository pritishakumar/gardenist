const request = require("supertest");

const app = require("./app");
const db = require("./db");


test("page not found - 404", async function () {
  const resp = await request(app).get("/no-path");
  expect(resp.statusCode).toEqual(404);
  expect(resp.body.error.message).toEqual("Not Found")
});

afterAll(function () {
  db.end();
});