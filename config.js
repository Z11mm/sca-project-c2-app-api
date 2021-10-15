// Calls .env file

require("dotenv").config();

module.exports = {
  db: {
    host: process.env.POSTGRES_HOST,
    name: process.env.POSTGRES_NAME,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    uri: process.env.DB_URI,
  },
};