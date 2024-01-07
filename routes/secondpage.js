// routes/users.js
const express = require('express');
const router = express.Router();


// Define a route
router.get('/', (req, res) => {
    res.send('this is secondpage route');// this gets executed when user visit http://localhost:3000/secondpage
});

router.get('/101', (req, res) => {
    res.send('this is secondpage 101 route');// this gets executed when user visit http://localhost:3000/secondpage/101
});


// export the router module so that server.js file can use it
module.exports = router;