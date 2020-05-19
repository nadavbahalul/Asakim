const express = require("express");
const categoryController = require("./controllers/category");
const productController = require("./controllers/product");
const storeController = require("./controllers/store");
const userController = require("./controllers/user");
const orderController = require("./controllers/order");
const checkAuth = require("./middlewares/check-auth");

const multer = require("multer");
const storage = multer.memoryStorage();
var upload = multer({ storage: storage });
const router = express.Router();

router.post("/order", orderController.newOrder);
router.get("/store", storeController.getStores);
router.get("/store/:id", storeController.getStore);
router.get("/store/products/:id", productController.getStoreProducts);
router.post(
  "/createStore",
  checkAuth,
  upload.single("image"),
  storeController.createStore
);
router.get("/category", categoryController.getCategories);
router.post("/auth/signup", userController.createNewUser);
router.post("/auth/login", userController.loginUser);
router.post("/auth/login/google", userController.loginUserWithGoogle);
router.get("/product", productController.getProducts);
router.get("/product/:id", checkAuth, productController.getProductById);
router.post("/products/ids", productController.getProductsByIDs);
router.get("/product/measureUnits", productController.getMeasureUnits);
router.post(
  "/product",
  checkAuth,
  upload.single("image"),
  productController.createProduct
);
router.post(
  "/product/update",
  checkAuth,
  upload.single("image"),
  productController.updateProduct
);

module.exports = router;
