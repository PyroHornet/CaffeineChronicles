var express = require('express');
var router = express.Router();
const pool = require('../mdb');

/* GET cart page. */
router.get('/', async function (req, res, next) {
    //res.render('homepage', { title: 'Express' });
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM Books LIMIT 1");
        res.render('cart', { books: rows });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error occurred');
    } finally {
        if (conn) conn.end();
    }
});

module.exports = router;

