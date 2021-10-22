// Entry file for server
const createServer = require('./server')
const config = require('./config')

const server = createServer();
const port = config.port || 3000;

server.listen(port, () => {
    console.log(
      `app is listening on port ${port} in ${process.env.NODE_ENV} environment `
    );
})