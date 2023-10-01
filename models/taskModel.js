const { default: mongoose } = require("mongoose");
const { PENDING, statusConstants } = require('./../utils/taskConstants');


const taskSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "A task can not exist without a name"],
        unique: [true, "Task name must be unique"],
        validate: {
            validator: function(value) {
                return value.length >= 4;
            },
            message: "Name should have at least 4 characters",
        },
    },
    description: {
        type: String,
        maxlength: 500,
    },
    status: {
        type: String,
        enum: statusConstants,
        default: PENDING,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    dueDate: {
        type: Date,
        required: [true, "Due date for the task must be specified"],
        validate: {
            validator: function(value) {
                return value > Date.now();
            },
            message: "Please specity due date in future"
        },
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updatedAt: {
        type: Date,
        deafult: Date.now(),
    },
    imageCover: {
        type: String,
    },
    priority: {
        type: Number,
        required: [true, "Priority for the task must be specified"],
        unique: [true, "Task priority must be unique"],
        validate: {
            validator: function(value) {
                return value >= 1;
            },
            message: "Priority can always be a positive number"
        },
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

// Populating virtual properties
taskSchema.virtual('daysLeft').get(function() {
    const timeLeft = this.dueDate - new Date();
    return Math.floor(timeLeft / (1000 * 24 * 60 * 60));
});

taskSchema.virtual('hoursLeft').get(function() {
    const timeLeft = this.dueDate - new Date();
    return Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
});

// Post save middlewares to restrict api sending version of the document to the client
taskSchema.post('save', function(doc, next) {
    doc.__v = undefined;
    next();
});

// Pre Query Middleware
taskSchema.pre(/^find/, function(next) {
    this.select('-__v');
    next();
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
