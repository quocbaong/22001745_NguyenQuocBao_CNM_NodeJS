const express = require("express")
const router = express.Router()

const upload = require("../middleware/upload")
const productController = require("../controllers/productController")

router.get("/",productController.getAllProducts)

router.get("/search",productController.searchProduct)

router.get("/add",productController.showAdd)

router.post("/add",
 upload.single("image"),
 productController.addProduct
)

router.get("/edit/:id",productController.showEdit)

router.post("/edit/:id",
 upload.single("image"),
 productController.updateProduct
)

router.get("/delete/:id",
 productController.deleteProduct
)

module.exports = router