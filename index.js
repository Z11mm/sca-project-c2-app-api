// Entry file for server
const createServer = require('./server')
const config = require('./config')

const server = createServer();
const env = config.environmentToExport;
const port = config.port;

server.listen(port, () => {
    console.log(
      `app is listening on port ${port} in ${process.env.NODE_ENV} environment `, env
    );
})