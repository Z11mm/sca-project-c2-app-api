// Calls .env file

require("dotenv-flow").config();

// for api
environments = {
    test: {
      "port": process.env.API_PORT_TESTENV,
      "envName": "test"
    },
    dev: {
      "port": process.env.API_PORT_DEVENV,
      "envName": "dev"
    },
    prod: {
      "port": process.env.API_PORT_PRODENV,
      "envName": "prod"
    }
  }

const currentEnv = typeof (process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV : '';
const environmentToExport = typeof (environments[currentEnv]) == 'object' ? environments[currentEnv] : environments.dev;

module.exports = {
  db: {
    host: process.env.POSTGRES_HOST,
    name: process.env.POSTGRES_NAME,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    uri: process.env.DB_URI,
  }
};