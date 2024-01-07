const express = require('express');
const app = express();

app.get("/", (req, res) => {
    res.send("<h1> Hello, Express.js Server! You have reached the root of things currently.... </h1>");
});

const homepageRoutes = require('./routes/homepage');
const secondRoutes = require('./routes/secondpage');

app.use('/homepage', homepageRoutes);
app.use('/secondpage', secondRoutes);


const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('Server is running on port ' + port);
});
