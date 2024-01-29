var express = require('express');
var router = express.Router();
const pool = require('../mdb');

/* GET users listing. */
router.get('/', async function(req, res, next) {
    //res.send('Thank you!');
    res.render('paymentConfirmation', { title: 'Confirmation' });




});

module.exports = router;
