const express = require('express');
const morgan = require('morgan');
const app = express();
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const taskRouter = require('./routes/taskRoutes');


if (process.env.ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

app.use(express.json());

app.use('/api/v1/tasks/', taskRouter);
`
When next function is called with an arg, express automatically assume that this is an Error 
and need to invoke Error Handling Middleware (middleware which takes args [err, req, res, next]).
`
app.all('*', (req, res, next) => {
    next(new AppError(`can't find ${req.originalUrl} on the server`, 404));
});

`
By specifying 4 parameters in the middleware function express automatically knows that this function is an
Error Handling Middleware and is called whenever we invoke next() function with an argument.
`
app.use(globalErrorHandler);

module.exports = app;
