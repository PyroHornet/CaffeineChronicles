// routes/users.js
const express = require('express');
const router = express.Router();


// Define a route
router.get('/', (req, res) => {
    res.send('this is test route');// this gets executed when user visit http://localhost:3000/othertest
});

router.get('/101', (req, res) => {
    res.send('this is test 101 route');// this gets executed when user visit http://localhost:3000/othertest/101
});

router.get('/102', (req, res) => {
    res.send('this is test 102 route');// this gets executed when user visit http://localhost:3000/othertest/102
});

// export the router module so that server.js file can use it
module.exports = router;