const express = require('express');
// Logging routes in console
const morgan = require('morgan');

const tourRouter = require('./routes/tourRouter');
const userRouter = require('./routes/userRouter');

// Creating app
const app = express();

// 1) MIDDLEWARES
// to have access to the request body we should add the next statement:
app.use(express.json());

// Custom middleware
app.use((req, res, next) => {
  console.log('Hello from the middleware !');
  next();
});

// Custom middleware with adding time where request is occured
app.use((req, res, next) => {
  req.requestedTime = new Date().toISOString();
  next();
});

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Middleware routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
