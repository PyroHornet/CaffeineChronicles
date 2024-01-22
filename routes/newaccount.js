var express = require('express');
var router = express.Router();
const validator = require('validator');
const pool = require('../mdb');

const validatePhoneNumber = (phoneNumber) => {
    // Validator library can handle different phone number formats
    return validator.isMobilePhone(phoneNumber, 'any', { strictMode: false });
};
const validateEmailAddress = (emailAddress) => {
    // Using validator for robust email validation
    return validator.isEmail(emailAddress);
};

/* GET users listing. */
router.get('/', function(req, res, next) {
    //res.send('respond with a resource');
    res.render('newaccount', { title: 'Express' });
});

router.post('/submit-account-form', async (req, res) => {
    const {username, password, lastName, firstName, phone, email, address, city, state, postalCode} = req.body;
    const errors = [];

    /*if (password !== confirm_password) {
        return res.status(400).send('Passwords do not match.');
    }*/

    if (!validateEmailAddress(email)) {
        errors.push({msg: 'Invalid email address'});
    }

    if (!validatePhoneNumber(phone)) {
        errors.push({msg: 'Invalid phone number'});
    }

    if (errors.length > 0) {
        res.render('newaccount', {errors}); // Render the form again with errors
    } else {
        try {

            // Insert data into the Customers database
            const query = 'INSERT INTO Customers ( lastName, firstName, PhoneNumber, EmailAddress, Address, city, state, postalCode) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?)';
            const result = await pool.query(query, [ lastName, firstName, phone, email, address, city, state, postalCode]);

            const customerId = result.insertId;

            const query2 = 'INSERT INTO UserCredentials (CustomerID, Username, UserPassword, EmailAddress, AuthLevel, LastLoginDate, LockOut) VALUES (?, ?, ?, ?, 0, CURRENT_DATE, 0)';
            const result2 = await pool.query(query2, [ customerId, username, password, email]);

            res.render("accountconfirmpage");
        } catch (error) {
            console.error(error);
            res.status(500).send('Error saving to database');
        }
    }
});

module.exports = router;