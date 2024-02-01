var express = require('express');
var router = express.Router();
const pool = require('../mdb');
var idValue = "";

/* GET home page. */
router.get('/', async function (req, res, next) {
  const { _raw, _json, user_id, ...userProfile } = req.user;
  let conn;
  const userid = req.user.user_id;
  const parts = userid.split("|");
  const idVal = parts[1];
  idValue = +idVal;

  try {

    if (!rows) {
      return res.status(500).send('Database query failed');
    }
    // Check if 'rows' is defined and is an array; if not, assign it an empty array
    if (!Array.isArray(rows)) {
      rows = [];
    }

    if (userRole === 'Manager') {
      res.render('dashboard');
    } else {
      res.render('homepage', {books: rows});
    }
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
