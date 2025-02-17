const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const jwt = require('jsonwebtoken');
const config = require('./config/config');
const hbs = require('hbs');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const showsRouter = require('./routes/shows');
const carritoRouter = require('./routes/carrito');
const authRouter = require('./routes/authRoutes');
const authMiddleware = require('./middlewares/authMiddleware');
const authMiddlewareMix = require('./middlewares/authMiddlewareMix');
/*  */
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials', function (err) {});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//middleware
/* app.use((req, res, next) => {
  const token = req.cookies.authToken;
  if (token) {
    jwt.verify(token, config.secretKey, (err, decoded) => {
      if (!err) {
        res.locals.user = decoded;
      } else {
        res.locals.user = null;
      }
      next(); 
    });
  } else {
    res.locals.user = null;
    next();
  }
}); */
/* app.use(authMiddleware); */
app.use(authMiddlewareMix);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/shows', showsRouter);
app.use('/carrito', carritoRouter);
app.use('/auth', authRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
