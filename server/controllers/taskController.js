
import mongoose from "mongoose";
import Project from "../models/Project.js";
import Task from "../models/Task.js";

// GET /api/projects/:id/tasks
export const getTasks = async (req, res, next) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    const { status, priority, search } = req.query;

    const filter = {
      project: project._id,
      owner: req.user._id
    };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    if (search?.trim()) {
      // Escape regex characters from user input
      const safeSearch = search.trim().replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      filter.title = {
        $regex: safeSearch,
        $options: "i"
      };
    }

    const tasks = await Task.find(filter).sort({
      createdAt: -1
    });

    return res.status(200).json({
      success: true,
      count: tasks.length,
      tasks
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/projects/:id/tasks
export const createTask = async (req, res, next) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    const {
      title,
      description,
      status,
      priority,
      dueDate
    } = req.body;

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      project: project._id,
      owner: req.user._id
    });

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      task
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/tasks/:id
export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    // Confirm that the parent project still belongs
    // to the authenticated user.
    const project = await Project.findOne({
      _id: task.project,
      owner: req.user._id
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    const allowedFields = [
      "title",
      "description",
      "status",
      "priority",
      "dueDate"
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        task[field] = req.body[field];
      }
    }

    await task.save();

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/tasks/:id/status
export const updateTaskStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    const project = await Project.exists({
      _id: task.project,
      owner: req.user._id
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    task.status = status;
    await task.save();

    return res.status(200).json({
      success: true,
      message: "Task status updated successfully",
      task
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/tasks/:id
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    const project = await Project.exists({
      _id: task.project,
      owner: req.user._id
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    await task.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};
