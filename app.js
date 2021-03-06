const createError     = require('http-errors');
const express         = require('express');
const path            = require('path');
const cookieParser    = require('cookie-parser');
const lessMiddleware  = require('less-middleware');
const httpLogger      = require('morgan');
const config          = require('./config/config');
const logger          = require('./lib/logger/logger');


//--loading own libraries-----------------------------------------------------------------------------------------------
const apiRouter    = require('./api/routers/apiRouter');
const mysqlDS      = require('./engine/datastore/mysqlDS');
const appName      = config.get('app:name');
if(config.get('app:datastore') ==='mysql') {
    mysqlDS.init(function () {
        const port = config.get('app:port');
        logger.info('[' + appName + ']', 'Listening on port: ' + port);
        logger.info('[' + appName + ']', 'Ready!');
    });
} else {
    logger.info('[' + appName + ']', 'Ready!');
}


//--initialization------------------------------------------------------------------------------------------------------
var app = express();


//--view engine setup---------------------------------------------------------------------------------------------------
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


//--middleware: general-------------------------------------------------------------------------------------------------
app.use(httpLogger('dev', {immediate: false}));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));


//--routes: add own routers---------------------------------------------------------------------------------------------
app.use('/api/v1/', apiRouter);


//--error handling: catch 404 and forward to error handler--------------------------------------------------------------
app.use(function (req, res, next) {
    next(createError(404));
});


//--error handling: prevent leaking stacktraces to user on production environment---------------------------------------
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


module.exports = app;
