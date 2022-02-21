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

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server`,
  // });

  const err = new Error(`Can't find ${req.originalUrl} on this server`);
  err.status = 'fail';
  err.statusCode = 404;
  next(err);
});

// Error handler middleware
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

module.exports = app;
