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

router.post('/', async function (req, res, next) {
    const { bookID, quantity, user_id } = req.body;
    console.log('User ID:', user_id);
    let conn;
    try {
        conn = await pool.getConnection();
        const user_id = req.user.user_id;
        const parts = user_id.split("|");
        const idVal = parts[1];
        idValue = +idVal;

        const query = 'SELECT Cart_ID FROM ShoppingCart WHERE UserID = ?';
        const result = await conn.query(query, [idValue]);
        const cID = result[0].Cart_ID;
        // const splitcID = cID.split(":");
        // const afterSplit = splitcID[1];
        // const cartIdentification = +afterSplit;
        console.log(cID);
        console.log(bookID);

        const query2 = 'INSERT INTO CartItems (Cart_ID, BookID, Quantity) VALUES (?, ?, ?)';
        const result2 = await conn.query(query2, [cID, bookID, quantity]);


        res.redirect('catalog');


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
