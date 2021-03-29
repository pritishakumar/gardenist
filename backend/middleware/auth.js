"use strict";

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { UnauthorizedError } = require("../expressError");

function verifyToken(req, res, next) {
    try {
      const authHeader = (req.headers && req.headers.authorization);

      if (authHeader) {
        const token = authHeader.slice(7);

        res.locals.user = jwt.verify(token, SECRET_KEY);

        return next();
      }
        throw new UnauthorizedError("Proper token needed")      
    } catch (err) {
      return next(err);
    }
  }


module.exports = {
    verifyToken
};