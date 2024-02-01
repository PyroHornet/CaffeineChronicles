var express = require('express');
var router = express.Router();
const pool = require('../mdb');
function checkIsManager(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'Manager') {
        next();
    } else {
        res.send('Access denied. This section is for managers only.');
    }
}

/* GET users listing. */
router.get('/',checkIsManager, function(req, res, next) {
    //res.send('respond with a resource');
    res.render("inventory");
});

module.exports = router;