
/module.exports = router;
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

/* GET inventory listing. */
router.get('/', checkIsManager, function(req, res, next) {
    pool.query('SELECT * FROM inventory', (err, results) => {
        if (err) {
            console.error('Error fetching inventory from database:', err);
            res.send('Error fetching inventory');
            return;
        }
        // Render the inventory template with the fetched results
        res.render("inventory", { books: results });
    });
});

module.exports = router;
