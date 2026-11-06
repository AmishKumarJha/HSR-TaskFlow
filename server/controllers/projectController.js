import Project from "../models/Project.js";
import Task from "../models/Task.js";

// ==========================================
// CREATE PROJECT
// POST /api/projects
// ==========================================

export const createProject = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    const project = await Project.create({
      title,
      description,
      owner: req.user._id
    });

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      project
    });

  } catch (error) {
    next(error);
  }
};


// ==========================================
// GET ALL USER PROJECTS
// GET /api/projects
// ==========================================

export const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({
      owner: req.user._id
    }).sort({
      createdAt: -1
    });

    return res.status(200).json({
      success: true,
      count: projects.length,
      projects
    });

  } catch (error) {
    next(error);
  }
};


// ==========================================
// UPDATE PROJECT
// PUT /api/projects/:id
// ==========================================

export const updateProject = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    // Prevent empty update requests
    if (
      title === undefined &&
      description === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "At least one field is required"
      });
    }

    // Find project belonging to logged-in user
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

    // Update provided fields only
    if (title !== undefined) {
      project.title = title;
    }

    if (description !== undefined) {
      project.description = description;
    }

    await project.save();

    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      project
    });

  } catch (error) {
    next(error);
  }
};


// ==========================================
// DELETE PROJECT
// DELETE /api/projects/:id
// ==========================================

export const deleteProject = async (req, res, next) => {
  try {
    // Verify ownership
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

    // Delete all associated tasks
    await Task.deleteMany({
      project: project._id,
      owner: req.user._id
    });

    // Delete project
    await project.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Project and associated tasks deleted successfully"
    });

  } catch (error) {
    next(error);
  }
};