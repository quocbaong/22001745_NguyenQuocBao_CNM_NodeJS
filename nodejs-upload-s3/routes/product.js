const express = require("express")
const router = express.Router()

const upload = require("../middleware/upload")
const Product = require("../models/Product")   // thêm dòng này

// hiển thị danh sách products
router.get("/products", async (req, res) => {
    const products = await Product.findAll()
    res.render("products/index", { products })
})

// hiển thị form tạo product
router.get("/products/create", (req, res) => {
    res.render("products/create-product")
})

// upload image + tạo product
router.post("/products", upload.single("image"), async (req, res) => {

    const imageUrl = req.file.location

    const product = {
        name: req.body.name,
        price: req.body.price,
        image: imageUrl
    }

    await Product.create(product)

    res.redirect("/products")
})

module.exports = router