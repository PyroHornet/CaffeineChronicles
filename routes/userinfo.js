var express = require('express');
var router = express.Router();
const validator = require('validator');
const pool = require('../mdb');
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
router.get('/', secured, function(req, res, next) {
    const { _raw, _json, ...userProfile } = req.user;

    res.render("userinfo", {
        title: "Profile",
        userProfile: userProfile
    });
});

router.post('/submit-account-form', async (req, res) => {
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
            //Change insert to update later on!!!!!!!!!
            const query = 'INSERT INTO Customers ( lastName, firstName, PhoneNumber, EmailAddress, Address, city, state, postalCode) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?)';
            const result = await pool.query(query, [ lastName, firstName, phone, email, address, city, state, postalCode]);

            res.render("userinfo");
            alert("Your information has been saved!");
        } catch (error) {
            console.error(error);
            res.status(500).send('Error saving to database');
        }
    }
});

module.exports = router;