const AppError = require('../utils/appError');
const Task = require('./../models/taskModel');
const catchAsync = require('./../utils/catchAsync');
const filterBody= require('./../utils/filterBody');


exports.getAllTasks = catchAsync(async (req, res, next) => {
    const tasks = await Task.find();
    res.status(200).json({
        status: "success",
        results: tasks.length,
        data: {
            tasks
        }
    });
});


exports.createTask = catchAsync(async (req, res, next) => {
    const { name, description, imageCover, priority, dueDate } = req.body;
    const newTask = await Task.create({
        name,
        description,
        imageCover,
        priority,
        dueDate,
    });
    res.status(201).json({
        status: "success",
        data: {
            task: newTask
        }
    });
});


exports.getTask = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) {
        return next(new AppError("No task found with that ID", 404));
    }
    res.status(200).json({
        status: "success",
        data: {
            task
        }
    });
});


exports.updateTask = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const allowedFields = ['name', 'description', 'status', 'dueDate', 'priority', 'imageCover']
    const updatedFields = filterBody(allowedFields, req.body);
    updatedFields['updatedAt'] = new Date();
    console.log(updatedFields);
    const task = await Task.findByIdAndUpdate(id, updatedFields, {
        new: true,
        runValidators: true,
    });
    if (!task) {
        return next(new AppError("No task found with that ID", 404));
    }
    res.status(200).json({
        status: "success",
        data: {
            task
        }
    });
});


exports.deleteTask = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) {
        return next(new AppError("No task found with that ID", 404));
    }
    task.isActive = false;
    await task.save();
    res.status(200).json({
        status: "success",
        message: "Task deleted successfully"
    });
});
