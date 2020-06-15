const https = require('https');
const app = require('./app');

const port = process.env.PORT || 5000;

const server = https.createServer(app);

server.listen(port, () => {
    console.log("listening on `${ PORT }`");
});
//app.listen(port);