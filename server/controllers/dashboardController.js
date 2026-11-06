
import Project from "../models/Project.js";
import Task from "../models/Task.js";

export const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Count projects belonging to the logged-in user
    const totalProjects = await Project.countDocuments({
      owner: userId,
    });

    // Run task statistics in parallel
    const [
      totalTasks,
      todoTasks,
      inProgressTasks,
      completedTasks,
      overdueTasks,
    ] = await Promise.all([
      Task.countDocuments({ owner: userId }),

      Task.countDocuments({
        owner: userId,
        status: "todo",
      }),

      Task.countDocuments({
        owner: userId,
        status: "in-progress",
      }),

      Task.countDocuments({
        owner: userId,
        status: "done",
      }),

      Task.countDocuments({
        owner: userId,
        dueDate: { $lt: new Date(), $ne: null },
        status: { $ne: "done" },
      }),
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalProjects,
        totalTasks,
        tasksByStatus: {
          todo: todoTasks,
          inProgress: inProgressTasks,
          completed: completedTasks,
        },
        overdueTasks,
      },
    });
  } catch (error) {
    next(error);
  }
};
