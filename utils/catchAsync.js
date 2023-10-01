`
1. Pass the handler function to the catchAsync function to handle async Errors.
2. We need next function in order to pass error into it & then to be handled by global error handling middleware.
3. It's the anonymous function which gets assigned to the route handlers.
`
module.exports = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
        // fn(req, res, next).catch((err) => next(err));
    };
};
