var express = require('express');
var router = express.Router();
const validator = require('validator');
const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: 'ao9moanwus0rjiex.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    user: 'fzsjdmm68733hgu4',
    password: 'kq86u525do1qwod4',
    database: 'f3uipf8n2hwoxtt3',
    connectionLimit: 1
});

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
    const {lastName, firstName, phone, email, address, city, state, postalCode} = req.body;
    const errors = [];

    if (!validatePhoneNumber(phone)) {
        errors.push({msg: 'Invalid phone number'});
    }
    if (!validateEmailAddress(email)) {
        errors.push({msg: 'Invalid email address'});
    }

    if (errors.length > 0) {
        res.render('newaccount', {errors}); // Render the form again with errors
    } else {
        try {
            // Insert data into the Customers database
            const query = 'INSERT INTO Customers (lastName, firstName, PhoneNumber, EmailAddress, Address, city, state, postalCode) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
            const result = await pool.query(query, [lastName, firstName, phone, email, address, city, state, postalCode]);

            res.render("accountconfirmpage");
        } catch (error) {
            console.error(error);
            res.status(500).send('Error saving to database');
        }
    }
});

module.exports = router;