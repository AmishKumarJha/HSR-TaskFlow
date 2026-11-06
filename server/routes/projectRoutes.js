import express from "express";
import { body, param } from "express-validator";

import protect from "../middleware/authMiddleware.js";
import validate from "../middleware/validateMiddleware.js";

import {
  createProject,
  getProjects,
  updateProject,
  deleteProject
} from "../controllers/projectController.js";

const router = express.Router();

// All project routes require authentication
router.use(protect);


// ==========================================
// CREATE PROJECT
// ==========================================

router.post(
  "/",
  [
    body("title")
      .exists()
      .withMessage("Project title is required")
      .bail()
      .isString()
      .withMessage("Title must be a string")
      .bail()
      .trim()
      .notEmpty()
      .withMessage("Project title cannot be empty")
      .isLength({ max: 100 })
      .withMessage("Title cannot exceed 100 characters"),

    body("description")
      .optional()
      .isString()
      .withMessage("Description must be a string")
      .bail()
      .trim()
      .isLength({ max: 1000 })
      .withMessage("Description cannot exceed 1000 characters")
  ],
  validate,
  createProject
);


// ==========================================
// GET ALL PROJECTS
// ==========================================

router.get("/", getProjects);


// ==========================================
// UPDATE PROJECT
// ==========================================

router.put(
  "/:id",
  [
    param("id")
      .isMongoId()
      .withMessage("Invalid project ID"),

    body("title")
      .optional()
      .isString()
      .withMessage("Title must be a string")
      .bail()
      .trim()
      .notEmpty()
      .withMessage("Title cannot be empty")
      .isLength({ max: 100 })
      .withMessage("Title cannot exceed 100 characters"),

    body("description")
      .optional()
      .isString()
      .withMessage("Description must be a string")
      .bail()
      .trim()
      .isLength({ max: 1000 })
      .withMessage("Description cannot exceed 1000 characters")
  ],
  validate,
  updateProject
);


// ==========================================
// DELETE PROJECT
// ==========================================

router.delete(
  "/:id",
  [
    param("id")
      .isMongoId()
      .withMessage("Invalid project ID")
  ],
  validate,
  deleteProject
);

export default router;