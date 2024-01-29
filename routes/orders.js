var express = require('express');
var router = express.Router();
const pool = require('../mdb');
var idValue = "";
const secured = (req, res, next) => {
    if (req.user) {
        return next();
    }
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
};

/* GET users listing. */
router.get('/', secured,  async function(req, res, next) {
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
            const query = 'SELECT OrderStatus, ShipDate, OrderTotal, Address, City, State, PostalCode FROM Orders WHERE UserID = ?';
            const rows = await conn.query(query, [idValue]);

            const orders = rows;
            res.render("orders", {
                Orders: orders,

            });

        } catch (err) {
            console.error(err);
            res.status(500).send('Error occurred');
        } finally {
            if (conn) conn.end();
        }
    } else {
        res.render('orders', { isAuthenticated: false, Orders: [] });
    }

});

module.exports = router;