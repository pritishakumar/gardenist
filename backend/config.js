/** application shared config */
"use strict";

require("dotenv").config();
require("colors");

const SECRET_KEY = process.env.SECRET_KEY || "dev-secret-key";

const PORT = +process.env.PORT || 3001

const BCRYPT_WORK_FACTOR = 12;

function DB_URI() {
    return (process.env.NODE_ENV === 'test')
    ? 'postgresql:///garden_test'
    : process.env.DB_URI || 'postgresql:///garden';
} 
  

console.log("----------------".blue);
console.log("Garden Advisor Config:".blue);
console.log("SECRET_KEY:".blue, SECRET_KEY);
console.log("PORT:".blue, PORT.toString());
console.log("BCRYPT_WORK_FACTOR".blue, BCRYPT_WORK_FACTOR);
console.log("Database:".blue, DB_URI());
console.log("----------------".blue);

module.exports = {
  BCRYPT_WORK_FACTOR,
  SECRET_KEY,
  PORT,
  DB_URI
};
