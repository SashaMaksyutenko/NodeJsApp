const path = require("path");
const express = require("express");
const isAuth = require("../middleware/is-auth");
const adminController = require("../controllers/admin");
const expressValidator = require("express-validator");
const { title } = require("process");
const router = express.Router();
router.get("/add-product", isAuth, adminController.getAddProduct);
router.get("/products", isAuth, adminController.getProducts);
router.post(
  "/add-product",
  [
    expressValidator.body("title").isString().isLength({ min: 3 }).trim(),
    expressValidator.body("imageUrl").isURL(),
    expressValidator.body("price").isFloat(),
    expressValidator.body("description").isLength({ min: 5, max: 400 }).trim(),
  ],
  isAuth,
  adminController.postAddProduct
);
router.get(
  "/edit-product/:productId",
  [
    expressValidator.body("title").isAlphanumeric().isLength({ min: 3 }).trim(),
    expressValidator.body("imageUrl").isURL(),
    expressValidator.body("price").isFloat(),
    expressValidator.body("description").isLength({ min: 5, max: 400 }).trim(),
  ],
  isAuth,
  adminController.getEditProduct
);
router.post("/edit-product", isAuth, adminController.postEditroduct);
router.post("/delete-product", isAuth, adminController.postDeleteProduct);
module.exports = router;
