// Calls .env file

require("dotenv-flow").config();

// const environments = {
//   test: {
//     port: 3050,
//     envName: 'test'
//   },
//   dev: {
//     port: 3002,
//     envName: 'development'
//   },
//   prod: {
//     port: 8000,
//     envName: 'prod'
//   },
// }

// const currentEnv = typeof (process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV : '';
// const environmentToExport = typeof (environments[currentEnv]) == 'object' ? environments[currentEnv] : environments.dev;


module.exports = {
  // environmentToExport,
  port: process.env.PORT,
  db: {
    host: process.env.POSTGRES_HOST,
    name: process.env.POSTGRES_NAME,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.DB_PORT,
    uri: process.env.DB_URI,
  },
};