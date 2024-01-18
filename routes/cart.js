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

/* GET cart page. */
router.get('/', async function (req, res, next) {
    let conn;
    try {
        conn = await pool.getConnection();
        // Modify the SQL query to retrieve items from the cart table based on the user or session
        const cartItems = await conn.query("SELECT * FROM Cart WHERE user_id = ? LIMIT 1", [req.user.id]);

        // Calculate the total price of items in the cart
        let total = 0;
        for (const item of cartItems) {
            total += item.price; // Assuming the column name for item price is 'price'
        }

        // Assuming you have a view named 'cart' to display cart items
        res.render('cart', { cartItems: cartItems, total: total });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error occurred');
    } finally {
        if (conn) conn.end();
    }
});

module.exports = router;
