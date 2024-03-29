/**
 * Required External Modules
 */
const express = require("express");
const router = express.Router();
const passport = require("passport");
const querystring = require("querystring");

require("dotenv").config();

/**
 * Routes Definitions
 */
router.get(
    "/login",
    passport.authenticate("auth0", {
        scope: "openid email profile"
    }),
    (req, res) => {
        res.redirect("/");
    }
);

router.get("/callback", (req, res, next) => {
    passport.authenticate("auth0", (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            console.log("Authentication failed: ", info);
            return res.redirect("/login");
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            const returnTo = req.session.returnTo;
            delete req.session.returnTo;
            res.redirect(returnTo || "/");
        });
    })(req, res, next);
});

router.get("/logout", (req, res) => {
    req.logOut(function(err) {
        if (err) {
            // Handle error
            return next(err);
        }
    })

    let returnTo = req.protocol + "://" + req.hostname;
    const port = req.socket.localPort;

    if (port !== undefined && port !== 80 && port !== 443) {
        returnTo =
            process.env.NODE_ENV === "production"
                ? `${returnTo}/`
                : `${returnTo}:${port}/`;
    } else {
        returnTo += '/';
    }

    const logoutURL = new URL(
        `https://${process.env.AUTH0_DOMAIN}/v2/logout`
    );

    const searchString = querystring.stringify({
        client_id: process.env.AUTH0_CLIENT_ID,
        returnTo: returnTo
    });
    logoutURL.search = searchString;

    res.redirect(logoutURL.href);
});

// Middleware to check if the user has Manager role
function checkIsManager(req, res, next) {
    const role = req.user['https://caffeine-chronicles-56787a68c136.herokuapp.com/role'];

    if (role === 'Manager') {
        next();
    } else {
        res.status(403).send('Insufficient role. Access denied to the Management Dashboard.');
    }
}

router.get(
    '/admin',
    passport.authenticate('auth0', { session: false }),
    checkIsManager,
    (req, res) => {
        // Manager role required to get here
        res.send('Hello, Manager!');
    }
);

/**
 * Module Exports
 */
module.exports = router;