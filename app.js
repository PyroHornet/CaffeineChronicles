var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const methodOverride = require('method-override');
require('dotenv').config();

//Things needed for OAuth & passport
const expressSession = require("express-session");
const passport = require("passport");
const Auth0Strategy = require("passport-auth0");
const authRouter = require("./auth");
const session = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
        sameSite: false

        // other cookie settings
    }
};

//Passport Configuration
const strategy = new Auth0Strategy(
    {
      domain: process.env.AUTH0_DOMAIN,
      clientID: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      callbackURL: process.env.AUTH0_CALLBACK_URL,
      state: true 
    },
    function(accessToken, refreshToken, extraParams, profile, done) {
      /**
       * Access tokens are used to authorize users to an API
       * (resource server)
       * accessToken is the token to call the Auth0 API
       * or a secured third-party API
       * extraParams.id_token has the JSON Web Token
       * profile has all the information from the user
       */
      return done(null, profile);
    }
);







var homepageRouter = require('./routes/homepage');
var usersRouter = require('./routes/users');
var contactRouter = require('./routes/contact');
var aboutRouter = require('./routes/about');
var catalogRouter = require('./routes/catalog');
var homeRouter = require('./routes/home');
var cartRouter = require('./routes/cart');
var loginRouter = require('./routes/login');
var newaccountRouter = require('./routes/newaccount');
var acconfirmRouter = require('./routes/accountconfirmation');
var paymentformRouter = require('./routes/paymentform');
var userinfoRouter = require('./routes/userinfo');
var paymentConfirmRouter = require('./routes/paymentConfirmation');
var ordersRouter = require('./routes/orders');
var EmployeeLoginRouter = require('./routes/EmployeeLogin');
const {requiresAuth} = require("express-openid-connect");




var app = express();

if (app.get("env") === "production") {
  app.set('trust proxy', 1); // trust first proxy
  // Serve secure cookies, requires HTTPS
  session.cookie.secure = true;
}


app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});

//App config

  // view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

  //Passport is initialized and using strategy
app.use(expressSession(session));

passport.use(strategy);
app.use(passport.initialize());
app.use(passport.session());

  //Store & retrieve user data from session
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

//added middleware
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.isAuthenticated();
    next();
});


app.use(methodOverride('_method'));
app.use("/", authRouter);
app.use(bodyParser.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));





app.use('/', homeRouter);
app.use('/', homepageRouter);
app.use('/users', usersRouter);
app.use('/contact', contactRouter);
app.use('/about', aboutRouter);
app.use('/catalog', catalogRouter);
app.use('/cart', cartRouter);
//app.use('/login', loginRouter);
app.use('/newaccount', newaccountRouter);
app.use('/accountconfirmation', acconfirmRouter);
app.use('/paymentform', paymentformRouter);
app.use('/userinfo', userinfoRouter);
app.use('/paymentConfirmation', paymentConfirmRouter);
app.use('/orders', ordersRouter);
app.use('/EmployeeLogin', EmployeeLoginRouter);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
