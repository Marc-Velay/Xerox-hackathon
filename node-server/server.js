const express        = require('express');
const bodyParser     = require('body-parser');

//const request        = require('request-promise');

//const IPFS = require('ipfs')
//const node = new IPFS()

const app = express();

// Allow cross origin resource sharing (CORS) within our application
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.use(bodyParser.urlencoded({ extended: true }));

require('./app/routes')(app, {});
const port = 8001
app.listen(port, () => {
  console.log('Example app listening on port ' + port);
});
