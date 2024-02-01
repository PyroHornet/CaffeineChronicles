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
router.get('/', checkIsManager, async function(req, res, next) {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query('SELECT * FROM Books');
        res.render('inventory', { books: rows });
    } catch (err) {
        console.error('Error occurred while fetching inventory:', err);
        res.status(500).send('Error occurred');
    } finally {
        if (conn) await conn.release(); // Properly release the connection to the pool
    }
});

module.exports = router;
