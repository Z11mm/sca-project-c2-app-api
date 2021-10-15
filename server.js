const express = require('express')
const routes = require('./routes')
const cors = require("cors");
const morgan = require("morgan");

const createServer = () => {
    const app = express();

    app.use(cors());
    app.use(morgan("combined"));
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }));
    app.use('/', routes);

    return app
}

module.exports = createServer;