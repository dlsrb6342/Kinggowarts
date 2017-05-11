var config = require('../config/config.json')[process.env.NODE_ENV || "development"];
var viewPath = config.path;
var express = require('express');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index');
// });

router.get('/get', function(req, res, next) {
  res.send(config);
});

module.exports = router;
