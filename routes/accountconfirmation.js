var express = require('express');
var router = express.Router();
const pool = require('../mdb');

router.get('/', function(req, res, next) {
    //res.send('respond with a resource');
    res.render('accountconfirmpage', { title: 'Express' });
});

module.exports = router;