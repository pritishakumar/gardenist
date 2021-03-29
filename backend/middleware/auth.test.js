"use strict";

const { verifyToken } = require("./auth");

/**  */
describe("verifyToken functionality", function() {
    const req = {
        headers: {
            authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJuYW1lIjoiVGVzdCBVc2VyIiwiaWF0IjoxNjE2NDUwMDc3fQ.11KGzWWRbzah6Sxgu_oHihgiEDBG7tTuErWL5sAF3xg" 
    }}  
    const next = (err=null) => {
        console.log(err);
    }
    test("verifyToken works", function () {
        const res = {
            locals: {}
        }
        const req = {
            headers: {
                authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJuYW1lIjoiVGVzdCBVc2VyIiwiaWF0IjoxNjE2NDUwMDc3fQ.11KGzWWRbzah6Sxgu_oHihgiEDBG7tTuErWL5sAF3xg" 
        }}  
        const result = verifyToken(req, res, next);
        expect(res.locals.user).toEqual({
           email: "test@test.com",
           iat: expect.any(Number),
           name: "Test User",
        });
    });
    test("verifyToken Error, invalid token", function () {
        let error = false;
        const next = (err=null) => {
            if (err) {
                error = true;
            }      
        }
        const res = {
            locals: {}
        }
        const req = {
            headers: {
                authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJuYW1lIjoiVGVzdCBVc2VyIiwiaWF0IjoxNjE2NDUwMDc3fQ.11KGzWWRbzah6Sxgu_oHihgiEDBG7tTuErWL5sAF3xg" 
        }}  
        const result = verifyToken(req, res, next);
        expect(error).toBe(true);
    });
});