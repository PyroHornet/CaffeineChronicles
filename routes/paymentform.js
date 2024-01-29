var express = require('express');
var router = express.Router();
const pool = require('../mdb');

/* GET users listing. */
router.get('/',  async function(req, res, next) {
    const absoluteTotal = req.session.absoluteTotal;
    const { _raw, _json, user_id, ...userProfile } = req.user;
    console.log('User ID:', user_id);
    let conn;
    try {
        conn = await pool.getConnection();
        const user_id = req.user.user_id;
        const parts = user_id.split("|");
        const idVal = parts[1];
        idValue = +idVal;
        const query = 'SELECT LastName, FirstName, Address, City, State, PostalCode, PhoneNumber, EmailAddress FROM Customers WHERE UserID = ?';
        const rows = await conn.query(query, [idValue]);
        if (rows.length === 0) {
            res.send("No data detected");
            return;

        }
        const customer = rows[0];
        res.render("paymentform", {
            Customer: customer,
            absoluteTotal: absoluteTotal
        });

    }
    catch (err) {
        console.error(err);
        res.status(500).send('Error occurred');
    }
    finally {
        if (conn) conn.end();
    }

});

router.post('/', async (req, res) => {
    const { user_id, address, city, state, postalCode} = req.body;
    const absoluteTotal = req.session.absoluteTotal;
    console.log('User ID:', user_id);
    let conn;
    const errors = [];

    // if (!validatePhoneNumber(phone)) {
    //     errors.push({msg: 'Invalid phone number'});
    // }
    // if (!validateEmailAddress(email)) {
    //     errors.push({msg: 'Invalid email address'});
    // }

    if (errors.length > 0) {
        res.render('paymentform', {errors}); // Render the form again with errors
    } else {
        try {
            conn = await pool.getConnection();
            const user_id = req.user.user_id;
            const parts = user_id.split("|");
            const idVal = parts[1];
            idValue = +idVal;
            // Insert data into the Orders database
            const query = 'INSERT INTO Orders (Address, City, State, PostalCode, OrderTotal, UserID) VALUES (?, ?, ?, ?, ?, ?)';
            const result = await conn.query(query, [ address, city, state, postalCode, absoluteTotal, idValue ]);

            const query2 = 'UPDATE CartItems ci\n' +
                '    JOIN Books bo ON ci.BookID = bo.BookID\n' +
                '    JOIN ShoppingCart sc ON ci.Cart_ID = sc.cart_id\n' +
                '    JOIN UserCredentials uc ON uc.UserID = sc.UserID\n' +
                'SET ci.Processing = false\n' +
                'WHERE sc.UserID = ?';
            const result2 = await conn.query(query2, [idValue]);


            conn.end();
            res.redirect('paymentConfirmation');

        } catch (error) {
            console.error(error);
            res.status(500).send('Error saving to database');
        }
    }
});

module.exports = router;