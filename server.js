const mongoose = require('mongoose');
const dotenv = require('dotenv');

`
Handle uncaught exceptions. Ex:- Using variable which doesn't exist, and some other programming Erros that
we developers introduce into the codebase.
`
process.on('uncaughtException', err => {
    console.log(`Unhandled Exceptions | ErrorName:- ${err.name} | ErrorMessage:- ${err.message}`);
    process.exit(1);
});

// console.log(variableThatDoesNotExist);

dotenv.config({ path: './config.env' });
const app = require('./app');

const DATABASE = process.env.DATABASE;
const PORT = process.env.PORT || 8000;


mongoose.connect(DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log(`Database connected successfully 🌎`);
}).catch((err) => {
    console.log(`Error while connecting DB: ${err}`);
});

const server = app.listen(PORT, () => {
    console.log(`Server running at: http://127.0.0.1:${PORT} 👋`);
});

`
Handle Errors outside express. Ex:- Mongoose connection Error, Redis Server Down Error etc.
Whenever these situations occur, the node process will emit (trigger) an event called 'unhandledRejection'.
`
process.on('unhandledRejection', err => {
    console.log(`Unhandled Rejections: ${err.name}, ${err.message}`);
    server.close(() => {
        process.exit(1);
    });
});
