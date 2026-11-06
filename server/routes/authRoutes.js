import express from "express";
import { body } from "express-validator";

import {
  registerUser,
  loginUser,
  getMe
} from "../controllers/authController.js";

import protect from "../middleware/authMiddleware.js";
import validate from "../middleware/validateMiddleware.js";

const router = express.Router();

// REGISTER
router.post(
  "/register",
  [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Name is required")
      .isLength({ min: 2, max: 50 })
      .withMessage("Name must be 2-50 characters"),

    body("email")
      .trim()
      .isEmail()
      .withMessage("Enter a valid email"),

    body("password")
      .isString()
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters")
  ],
  validate,
  registerUser
);

// LOGIN
router.post(
  "/login",
  [
    body("email")
      .trim()
      .isEmail()
      .withMessage("Enter a valid email"),

    body("password")
      .isString()
      .notEmpty()
      .withMessage("Password is required")
  ],
  validate,
  loginUser
);

// CURRENT USER
router.get("/me", protect, getMe);

export default router;