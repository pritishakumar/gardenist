const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

/** return  JWT from user data. */

function createToken(user) {
  const { email, name } = user;
  let payload = { email, name };

  return jwt.sign(payload, SECRET_KEY);
}

module.exports = { createToken };