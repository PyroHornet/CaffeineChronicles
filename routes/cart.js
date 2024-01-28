var express = require('express');
var router = express.Router();
const pool = require('../mdb');

/* GET cart page. */
router.get('/', async function (req, res, next) {
    if (req.isAuthenticated()) {
        const {_raw, _json, user_id, ...userProfile} = req.user;
        console.log('User ID:', user_id);
        let conn;
        try {
            conn = await pool.getConnection();
            const user_id = req.user.user_id;
            const parts = user_id.split("|");
            const idVal = parts[1];
            idValue = +idVal;
            const query = 'SELECT BookTitle, SUM(Quantity) AS TotalQuantity, SUM(Price) AS TotalPrice\n' +
                'FROM CartItems AS ci\n' +
                '         JOIN Books AS bo ON ci.BookID = bo.BookID\n' +
                '         JOIN ShoppingCart AS sc ON ci.Cart_ID = sc.cart_id\n' +
                '         JOIN UserCredentials AS uc ON uc.UserID = sc.UserID\n' +
                'WHERE sc.UserID = ? && ci.Processing = true\n' +
                'GROUP BY BookTitle';
            const rows = await conn.query(query, [idValue]);

            const customer = rows[0];
            let totalCartPrice = 0;
            let tax = .03;
            let shipping = 10;
            let absoluteTotal = 0;


            rows.forEach(row => {
                totalCartPrice += parseFloat(row.TotalPrice);
            });

            absoluteTotal = totalCartPrice + (totalCartPrice * tax) + shipping;
            tax = totalCartPrice * tax;

            res.render("cart", {
                isAuthenticated: true,
                books: rows,
                totalCartPrice: totalCartPrice,
                tax: tax,
                shipping: shipping,
                absoluteTotal: absoluteTotal

            });

        } catch (err) {
            console.error(err);
            res.status(500).send('Error occurred');
        } finally {
            if (conn) conn.end();
        }
    } else {
        // User is not authenticated, render the cart page with default/empty values
        res.render('cart', { isAuthenticated: false, cartItems: [] });
    }
});

// Route to delete a group of books by title
router.delete('/', async (req, res) => {
    const { _raw, _json, user_id, bookTitle, ...userProfile } = req.user;
    let conn;
    try {
        conn = await pool.getConnection();
        const userid = req.user.user_id;
        const parts = userid.split("|");
        const idVal = parts[1];
        idValue = +idVal;
        const bookT = req.body.bookTitle;
        const query = 'DELETE ci\n' +
            'FROM CartItems AS ci\n' +
            'JOIN Books AS bo ON ci.BookID = bo.BookID\n' +
            'JOIN ShoppingCart AS sc ON ci.Cart_ID = sc.Cart_id\n' +
            'WHERE sc.UserID = ? AND bo.BookTitle = ? AND ci.Processing = true';

        const rows = await conn.query(query, [idValue, bookT]);
        if (rows) {
            console.log("Deleted");
            res.status(200).send('Items successfully deleted.');
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

module.exports = router;

