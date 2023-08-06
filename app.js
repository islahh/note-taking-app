const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const http_logger = require('morgan');

require("dotenv").config()
// require passport
const passport = require('passport');
require('./api/services/passport')(passport);
const app = express();
const PORT = process.env.PORT || 3000;

try {
  console.time("Booting up time");
  console.time("Loading views, controllers and routes");
  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'pug');

  app.use(http_logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(passport.initialize());

  // Routes
  app.use(require('./api/routes'))
  app.get('/', function (req, res) {
    console.log('Note taking app is up and running!');
    res.send('Note taking app is up and running')
  });

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

  console.log("===================================");
  console.timeEnd("Loading controllers and routes");
  console.log("===================================");
  console.timeEnd("Booting up time");
  console.log("===================================");
  console.log(`[WEB] Service listening 👍: PORT: ${PORT}`);
  app.listen(PORT);

} catch (error) {
  console.error("Uh Oh! Error found");
  const bind = typeof PORT === "string"
    ? "Pipe " + PORT
    : "Port " + PORT;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

module.exports = app;
