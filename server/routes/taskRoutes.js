
import express from "express";
import { body, param, query } from "express-validator";

import protect from "../middleware/authMiddleware.js";
import validate from "../middleware/validateMiddleware.js";

import {
  getTasks,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask
} from "../controllers/taskController.js";

const router = express.Router();

router.use(protect);

// Reusable validators
const projectIdValidation = [
  param("id")
    .isMongoId()
    .withMessage("Invalid project ID")
];

const taskIdValidation = [
  param("id")
    .isMongoId()
    .withMessage("Invalid task ID")
];

const titleValidation = body("title")
  .isString()
  .withMessage("Title must be a string")
  .bail()
  .trim()
  .notEmpty()
  .withMessage("Task title is required")
  .isLength({ max: 150 })
  .withMessage("Title cannot exceed 150 characters");

const descriptionValidation = body("description")
  .optional()
  .isString()
  .withMessage("Description must be a string")
  .bail()
  .trim()
  .isLength({ max: 2000 })
  .withMessage("Description cannot exceed 2000 characters");

const statusValidation = body("status")
  .optional()
  .isIn(["todo", "in-progress", "done"])
  .withMessage("Invalid task status");

const priorityValidation = body("priority")
  .optional()
  .isIn(["low", "medium", "high"])
  .withMessage("Invalid task priority");

const dueDateValidation = body("dueDate")
  .optional({ values: "null" })
  .isISO8601({ strict: true, strictSeparator: true })
  .withMessage("Invalid due date")
  .toDate();

// GET tasks with filtering and search
router.get(
  "/projects/:id/tasks",
  [
    ...projectIdValidation,
    query("status")
      .optional()
      .isIn(["todo", "in-progress", "done"])
      .withMessage("Invalid status filter"),

    query("priority")
      .optional()
      .isIn(["low", "medium", "high"])
      .withMessage("Invalid priority filter"),

    query("search")
      .optional()
      .isString()
      .withMessage("Search must be a string")
      .bail()
      .isLength({ max: 100 })
      .withMessage("Search cannot exceed 100 characters")
  ],
  validate,
  getTasks
);

// CREATE task inside a project
router.post(
  "/projects/:id/tasks",
  [
    ...projectIdValidation,
    titleValidation,
    descriptionValidation,
    statusValidation,
    priorityValidation,
    dueDateValidation
  ],
  validate,
  createTask
);

// UPDATE task
router.put(
  "/tasks/:id",
  [
    ...taskIdValidation,
    titleValidation.optional(),
    descriptionValidation,
    statusValidation,
    priorityValidation,
    dueDateValidation
  ],
  validate,
  updateTask
);

// UPDATE task status only
router.patch(
  "/tasks/:id/status",
  [
    ...taskIdValidation,
    body("status")
      .notEmpty()
      .withMessage("Status is required")
      .isIn(["todo", "in-progress", "done"])
      .withMessage("Invalid task status")
  ],
  validate,
  updateTaskStatus
);

// DELETE task
router.delete(
  "/tasks/:id",
  taskIdValidation,
  validate,
  deleteTask
);

export default router;
