const express = require("express");
const authController = require("../controllers/auth");
const router = express.Router();
const expressValidator = require("express-validator");
const User = require("../models/user");
router.get("/login", authController.getLogin);
router.get("/signup", authController.getSignup);
router.post(
  "/login",
  [
    expressValidator
      .check("email")
      .isEmail()
      .withMessage("Please enter a valid email address.")
      .normalizeEmail(),
    expressValidator
      .body("password")
      .isLength({ min: 5 })
      .withMessage(
        "Password has to be at least 5 characters long and contain only letters and numbers"
      )
      .isAlphanumeric()
      .trim(),
  ],
  authController.postLogin
);
router.post(
    "/signup",
    [
      expressValidator
        .check("email")
        .notEmpty()
        .isEmail()
        .withMessage("Please enter a valid email")
        .custom((value, { req }) => {
          return User.findOne({ email: value }).then((userDoc) => {
            if (userDoc) {
              return Promise.reject(
                "E-Mail already exists, please pick a different one."
              );
            }
          });
        })
        .normalizeEmail(),
      expressValidator
        .check("password")
        .notEmpty()
        .withMessage("Please enter a password")
        .isLength({ min: 5 })
        .trim()
        .withMessage("Password must be at least 5 characters long"),
      expressValidator
        .check("confirmPassword")
        .notEmpty()
        .withMessage("Please confirm your password")
        .trim()
        .custom((value, { req }) => {
          if (value !== req.body.password) {
            throw new Error("Passwords must match");
          }
          return true;
        }),
    ],
    authController.postSignup
  );
router.post("/logout", authController.postLogout);
router.get("/reset", authController.getReset);
router.post("/reset", authController.postReset);
router.get("/reset/:token", authController.getNewPassword);
router.post("/new-password", authController.postNewPassword);
module.exports = router;
