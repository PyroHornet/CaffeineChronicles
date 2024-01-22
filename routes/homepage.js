var express = require('express');
var router = express.Router();
const pool = require('../mdb');

/* GET home page. */
router.get('/', async function (req, res, next) {
  //res.render('homepage', { title: 'Express' });
  let conn;
  try {
    conn = await pool.getConnection();
    let rows = await conn.query('SELECT * FROM Books WHERE IsFeatured IS TRUE');
    if (!rows) {
      return res.status(500).send('Database query failed');
    }
    // Check if 'rows' is defined and is an array; if not, assign it an empty array
    if (!Array.isArray(rows)) {
      rows = [];
    }
    res.render('homepage', { books: rows });
  }
  catch (err) {
    console.error(err);
    res.status(500).send('Error occurred');
  }
  finally {
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
