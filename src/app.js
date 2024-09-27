const globalConstants = require('./const/globalConst')
const join = globalConstants.JOIN;
const dirname = globalConstants.DIRNAME;

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index.routes');
var app = express();

const configurationApi = (app) => {
  // view engine setup
  app.set('views', join(dirname, 'views'));
  app.set('view engine', 'pug');
  
  //app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static('public'));
}

const configurationRoute = (app) => {
  app.use('/api',indexRouter.routes_init());
  app.use('/', indexRouter.routes_init());
  

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
}

function init ()  {

  configurationApi(app);   
  configurationRoute(app);
}

init();

module.exports = app;
