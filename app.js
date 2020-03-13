// Environment and configurations, importing executes the script
import './config';

import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import helmet from 'helmet';
import cors from 'cors';
import config from 'config';

// Babel imports, even though they aren't directly referenced, they need to be here
import babelCore from 'babel-core/register';
import babelPolyfill from 'babel-polyfill';

// Database connection imports
import mongoose from 'mongoose';
import passport from 'passport';
import uuidv4 from 'uuid/v4';
import session from 'express-session';
import db from './database/dbConnection';

// Router imports
import indexRouter from './routes/index';
import usersRouter from './routes/users';
import securityRouter from './routes/security';

/** *********************************************************** */
// Imports for authentication
import passportAuth from './authentication/passportAuth';

const MongoStore = require('connect-mongo')(session);

/** *********************************************************** */
// Establish database connection
db.dbConnection();

/** *********************************************************** */

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());

/** *********************************************************** */

// Configure sessions
app.use(
  session({
    genid: req => {
      return uuidv4(); // Use UUIDs for session IDs
    },
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
    }),
    secret: process.env.SESSION_SECRET_KEY,
    resave: false, // setting true forces a resave in store even if session not changed
    rolling: true, // setting true updates expiration with maxAge after every user request
    saveUninitialized: true, // setting true saves even unmodified sessions
    cookie: {
      httpOnly: true,
      maxAge: config.get('session.max_age'),
      // secure: true, // Set this to true only after veniqa has a ssl enabled site
    },
  }),
);

/** *********************************************************** */

/** *********************************************************** */
// Configure authentication

passportAuth.initializePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

/** *********************************************************** */

/** *********************************************************** */

// To Allow cross origin requests originating from selected origins
const corsOptions = {
  /*
    "allowed_origins": [
      "https://dev-veniqa-admin.netlify.com",
      "http://localhost:5202"
    ],
    //production
    "allowed_origins": [
        "https://admin.veniqa.com"
    ],
  */
  origin: config.get('allowed_origins'),
  methods: ['GET, POST, OPTIONS, PUT, DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));

/** *********************************************************** */

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/security', securityRouter);

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
