var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('homepage', { title: 'Express' });
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
