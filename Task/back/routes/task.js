const router = require("express").Router();
const Task = require("../models/task");
const User = require("../models/user");
const { authenticationToken } = require("./auth");

// Creat Task
router.post("/create-task", authenticationToken, async (req, res) => {
    try {
        const { title, desc } = req.body;
        const { id } = req.headers;
        const newTask = new Task({ title: title, desc: desc });
        const saveTask = await newTask.save();
        const taskId = saveTask._id;
        await User.findByIdAndUpdate(id, { $push: { tasks: taskId._id } });
        res.status(200).json({ message: "Task Created" })

    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Internal Server Error" });
    }
});

// Get-All-Tasks
router.get("/get-all-tasks", authenticationToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const userData = await User.findById(id).populate({ path: "tasks", options: { sort: { createdAt: -1 } }, });
        res.status(200).json({ data: userData });

    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Internal Server Error" });
    }
});

// Delete Task
router.delete("/delete-task/:id", authenticationToken, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.headers.id;
        await Task.findByIdAndDelete(id);
        await User.findByIdAndUpdate(userId, { $pull: { tasks: id } });
        res.status(200).json({ message: "Task deleted succesfully" });

    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Internal Server Error" });
    }
});

// Update Task
router.put("/update-task/:id", authenticationToken, async (req, res) => {
    try {
        const { id } = req.params;
        const {title,desc} = req.body;
        await Task.findByIdAndUpdate(id,{title:title,desc:desc});
        res.status(200).json({ message: "Task updated succesfully" });

    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Internal Server Error" });
    }
});

// Update Important Task
router.put("/update-imp-task/:id", authenticationToken, async (req, res) => {
    try {
        const { id } = req.params;
        const TaskData = await User.findById(id);
        const ImpTask = TaskData.important;
        await Task.findByIdAndUpdate(id,{important: !ImpTask});
        res.status(200).json({ message: "Task updated succesfully" });

    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Internal Server Error" });
    }
});

// Update Complete Task
router.put("/update-complete-task/:id", authenticationToken, async (req, res) => {
    try {
        const { id } = req.params;
        const TaskData = await User.findById(id);
        const CompleteTask = TaskData.complete;
        await Task.findByIdAndUpdate(id,{complete: !CompleteTask});
        res.status(200).json({ message: "Task updated succesfully" });

    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Internal Server Error" });
    }
});

// Get-Imp-Tasks
router.get("/get-imp-tasks", authenticationToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const Data = await User.findById(id).populate({ path: "tasks", match:{important:true}, options: { sort: { createdAt: -1 } }, });
        const ImpTaskData = Data.tasks;
        res.status(200).json({ data: ImpTaskData });

    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Internal Server Error" });
    }
});

// Get-Complete-Tasks
router.get("/get-complete-tasks", authenticationToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const Data = await User.findById(id).populate({ path: "tasks", match:{complete:true}, options: { sort: { createdAt: -1 } }, });
        const CompleteTaskData = Data.tasks;
        res.status(200).json({ data: CompleteTaskData });

    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Internal Server Error" });
    }
});

// Get-InComplete-Tasks
router.get("/get-incomplete-tasks", authenticationToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const Data = await User.findById(id).populate({ path: "tasks", match:{complete:false}, options: { sort: { createdAt: -1 } }, });
        const CompleteTaskData = Data.tasks;
        res.status(200).json({ data: CompleteTaskData });

    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Internal Server Error" });
    }
});
module.exports = router;