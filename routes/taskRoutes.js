const router = require('express').Router();
const taskController = require('./../controllers/taskController');


router.route('/')
.get(taskController.getAllTasks)
.post(taskController.createTask)

router.route('/:id')
.get(taskController.getTask)
.put(taskController.updateTask)
.delete(taskController.deleteTask)


module.exports = router;
