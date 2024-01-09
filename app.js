var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

var homepageRouter = require('./routes/homepage');
var usersRouter = require('./routes/users');
var contactRouter = require('./routes/contact');
var aboutRouter = require('./routes/about');
var catalogRouter = require('./routes/catalog');
var homeRouter = require('./routes/home');
var cartRouter = require('./routes/cart');
var loginRouter = require('./routes/login');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//added middleware
app.use(bodyParser.json());
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public/stylesheets')));
app.use(express.static(path.join(__dirname, 'public/images')));
app.use(express.static(path.join(__dirname, 'public/javascripts')));




app.use('/', homeRouter);
app.use('/', homepageRouter);
app.use('/users', usersRouter);
app.use('/contact', contactRouter);
app.use('/about', aboutRouter);
app.use('/catalog', catalogRouter);
app.use('/cart', cartRouter);
app.use('/login', loginRouter);
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
