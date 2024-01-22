var express = require('express');
var router = express.Router();
const pool = require('../mdb');

/* GET users listing. */
router.get('/', function(req, res, next) {
    //res.send('respond with a resource');
    res.render("about");
});

module.exports = router;