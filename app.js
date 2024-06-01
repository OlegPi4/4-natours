// app.js
// IMPORTS
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const globalErrorHendler = require('./controllers/errorController');
const AppError = require('./utils/appErrors.js');
const tourRouter = require('./routes/toureRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());

// Development loggining
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// Limit request from same PI
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Body parser. Reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

// Serving static files
app.use(express.static(`${__dirname}/public`));

// Test middlewar
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  //  console.log(req.headers);
  next();
});

///  ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

/// HENDLER ERROR
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHendler);

module.exports = app;
