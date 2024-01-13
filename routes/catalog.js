var express = require('express');
var router = express.Router();
const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: 'ao9moanwus0rjiex.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    user: 'fzsjdmm68733hgu4',
    password: 'kq86u525do1qwod4',
    database: 'f3uipf8n2hwoxtt3',
    connectionLimit: 1
});

/* GET catalog listing. */
router.get('/', async function (req, res, next) {
    //res.send('respond with a resource');
    //res.render('catalog', {title: 'Express'});
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query('SELECT * FROM Books');
        res.render('catalog', { books: rows });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error occurred');
    } finally {
        if (conn) conn.end();
    }
});

module.exports = router;