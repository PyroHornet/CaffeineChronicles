var express = require('express');
var router = express.Router();
const validator = require('validator');
const pool = require('../mdb');
var idValue = "";
const secured = (req, res, next) => {
    if (req.user) {
        return next();
    }
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
};

const validatePhoneNumber = (phoneNumber) => {
    // Validator library can handle different phone number formats
    return validator.isMobilePhone(phoneNumber, 'any', { strictMode: false });
};

const validateEmailAddress = (emailAddress) => {
    // Using validator for robust email validation
    return validator.isEmail(emailAddress);
};

/* GET users listing. */
router.get('/', secured, async function(req, res, next) {
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
        let roleQuery =  'SELECT Role FROM UserCredentials WHERE UserID = ?';
        let rows2 = await conn.query(roleQuery, [idValue]);
        const userRole = rows2[0].Role;
        const rows = await conn.query(query, [idValue]);
        req.session.userR = userRole;
        req.session.save(err => {
            if (err) {
                // handle error
                console.error('Session save error:', err);
            }
            res.render("userinfo", { /* your data for rendering */ });
        });
        if (rows.length === 0) {
            res.send("No data detected");
            return;

        }
        const customer = rows[0];
        res.render("userinfo", {
            Customer: customer,
            userRole: userRole
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
    const { lastName, firstName, phone, email, address, city, state, postalCode} = req.body;
    const errors = [];

    if (!validatePhoneNumber(phone)) {
        errors.push({msg: 'Invalid phone number'});
    }
    if (!validateEmailAddress(email)) {
        errors.push({msg: 'Invalid email address'});
    }

    if (errors.length > 0) {
        res.render('userinfo', {errors}); // Render the form again with errors
    } else {
        try {
            // Insert data into the Customers database
            const query = 'UPDATE Customers SET lastName = ?, firstName = ?, PhoneNumber = ?, EmailAddress = ?, Address = ?, city = ?, state = ?, postalCode = ? WHERE UserID = ?';
            const result = await pool.query(query, [ lastName, firstName, phone, email, address, city, state, postalCode, idValue ]);


            res.redirect('userinfo');
        } catch (error) {
            console.error(error);
            res.status(500).send('Error saving to database');
        }
    }
});

module.exports = router;