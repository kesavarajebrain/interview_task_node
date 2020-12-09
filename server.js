//express package
const express = require('express');
//middleware package
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
const api = require('./routes/api');
app.use(cors());
app.use('/api', api);

app.use(function (req, res, next) {
  //set headers to allow cross origin request.
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.get('/api', function (req, res) {
    res.end('file catcher example');
  });
app.listen(process.env.PORT || 5000);
console.log('Node server running on port', 5000);
