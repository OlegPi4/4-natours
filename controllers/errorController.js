const AppError = require('./../utils/appErrors');

const handlerJWTError = () =>
  new AppError('Invalid token. Please login again! ', 401);

const handlerJWTExpiredError = () =>
  new AppError('Your token has expired! Please login again.', 401);

const sendErrorDev = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      operation: err.isOperational ? true : false,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    // RENDER website
    console.error('ERROR', err);
    res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
    });
  }
};

const sendErrorProd = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    console.error('ERROR', err);
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong, please try again later.',
    });
  }
  // RENDER website
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong! ',
      msg: err.message,
    });
  }
  console.error('ERROR', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong! ',
    msg: 'Please try again later.',
  });
};

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.keyValue.name;
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const message = `Invalid input data - ${err.message}`;
  return new AppError(message, 400);
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (err.name === 'CastError') error = handleCastErrorDB(error);
    if (err.name === 'ValidationError') {
      error.message = err.message;
      error = handleValidationErrorDB(error);
    }
    if (err.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'JsonWebTokenError') error = handlerJWTError();
    if (error.name === 'TokenExpiredError') error = handlerJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};
