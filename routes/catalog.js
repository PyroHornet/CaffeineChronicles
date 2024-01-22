var express = require('express');
var router = express.Router();
const pool = require('../mdb');

/* GET catalog listing. */
router.get('/', async function (req, res, next) {
    //res.send('respond with a resource');
    //res.render('catalog', {title: 'Express'});
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query('SELECT * FROM Books');
        res.render('catalog', { books: rows });
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Error occurred');
    }
    finally {
        if (conn) conn.end();
    }
});

module.exports = router;
