const adminControllers = require("../controller/admin");
const fileUploader = require("../lib/uploader");
const { authorizedLoginAdmin } = require("../middleware/authorizeLoginAdmin");

const router = require("express").Router();

// Input New Product
router.post(
  "/product",
  fileUploader({
    destinationFolder: "product",
    prefix: "PRODUCT",
    fileType: "image",
  }).array("product_image_file", 5),
  adminControllers.addProduct
);

// Input New Product Category
router.post("/product-category", adminControllers.addProductCategory);

// Get Product Category
router.get("/product-category", adminControllers.getAllProductCategory);

// Get Product
router.get("/product", adminControllers.getProduct);

// Edit Product
router.patch(
  "/product/:productId",
  authorizedLoginAdmin,
  adminControllers.editProduct
);

// Edit Product Images
router.put(
  "/product-images/:productId",
  fileUploader({
    destinationFolder: "product",
    prefix: "PRODUCT",
    fileType: "image",
  }).array("product_image_file", 5),
  adminControllers.editProductImages
);

// Delete Product
router.delete(
  "/product/:productId",
  authorizedLoginAdmin,
  adminControllers.deleteProduct
);

module.exports = router;
