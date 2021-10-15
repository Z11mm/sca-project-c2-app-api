const createServer = require('./server')

const server = createServer();
const port = process.env.PORT;

server.listen(port, () => {
    console.log(
      `app is listening on port ${port} in ${process.env.NODE_ENV} environment `
    );
})