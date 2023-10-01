const AppError = require("./../utils/appError");


const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
    const value = err.message.match(/{([^}]*)}/)[0];
    const message = `Duplicate field value: ${value}, Please use another value`.replace('{', '').replace('}', '');
    return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
    // Object.values({a:1,b:2,c:3}) outputs: [1,2,3] (Converts Object into Array Values)
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};

const sendErrorProd = (err, res) => {
    // Operational Errors that we create manually.
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    } else {
        // Programming or other unknown errors. Don't leak details to client
        console.error(`ERROR 🤯: ${err}`);
        res.status(500).json({
            status: "error",
            message: "Something went wrong"
        });
    }
};

// Global Error Handling Middleware with 4 args
module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.ENV === 'development') {
        sendErrorDev(err, res);
    } else if (process.env.ENV == 'production') {
        console.log(err);
        // The commented code is buggy, for research purposes check it later.
        // let error = { ...err };
        // console.log(error.name); //undefined
        `
        if it's DB Error create it manually (adding isOperational=true) using AppError class
        as this Error Handling Middleware is directly invoked in the catchAsync handler.
        `
        if (err.name === "CastError") err = handleCastErrorDB(err);
        else if (err.code === 11000) err = handleDuplicateFieldsDB(err);
        else if (err.name === "ValidationError") err = handleValidationErrorDB(err);
        sendErrorProd(err, res);
    }
};
