var express = require('express');
var router = express.Router();
const pool = require('../mdb');


function checkIsManager(req, res, next) {
    req.user.role = req.session.userR;
    if (req.isAuthenticated() && req.user.role === 'Manager') {
        next();
    } else {
        res.send('Access denied. This section is for managers only.');
        console.log(req.user.role);
    }
}

/* GET users listing. */
router.get('/', checkIsManager, function(req, res, next) {
    //res.send('respond with a resource');
    res.render("dashboard");
});

module.exports = router;