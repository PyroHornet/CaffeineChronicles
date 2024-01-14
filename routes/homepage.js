var express = require('express');
var router = express.Router();
const mariadb = require('mariadb');

const featuredPool = mariadb.createPool({
  host: 'ao9moanwus0rjiex.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
  user: 'fzsjdmm68733hgu4',
  password: 'kq86u525do1qwod4',
  database: 'f3uipf8n2hwoxtt3',
  connectionLimit: 1
});

/* GET home page. */
router.get('/', async function (req, res, next) {
  //res.render('homepage', { title: 'Express' });
  let conn;
  try {
    conn = await featuredPool.getConnection();
    const rows = await conn.query("SELECT * FROM Books WHERE IsFeatured IS TRUE");
    res.render('homepage', { books: rows });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error occurred');
  } finally {
    if (conn) conn.end();
  }
});

router.post('/', function(req, res, next) {
  //logic to add new data
  res.status(201).send('Data created');
});

router.put('/', function(req, res, next) {
  //logic to update data
});

router.delete('/', function(req, res, next) {
  //logic to delete data
});



module.exports = router;
