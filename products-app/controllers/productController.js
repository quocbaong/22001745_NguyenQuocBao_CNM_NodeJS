const { v4: uuidv4 } = require("uuid")
const s3 = require("../config/s3")
const productModel = require("../models/productModel")

function getS3KeyFromUrl(url) {
    if (!url) return null
    const parts = url.split(".amazonaws.com/")
    return parts.length === 2 ? parts[1] : null
}

async function deleteS3Url(url) {
    const key = getS3KeyFromUrl(url)
    if (!key) return

    await s3
        .deleteObject({
            Bucket: process.env.S3_BUCKET,
            Key: key
        })
        .promise()
}

const DEFAULT_LIMIT = 5

exports.getAllProducts = async(req, res) => {
    try {
        const keyword = (req.query.keyword || "").trim().toLowerCase()
        const page = Math.max(1, parseInt(req.query.page, 10) || 1)
        const limit = Math.max(1, parseInt(req.query.limit, 10) || DEFAULT_LIMIT)

        const allProducts = await productModel.scanAll()
        const filtered = keyword ?
            allProducts.filter((p) => p.name && p.name.toLowerCase().includes(keyword)) :
            allProducts

        const total = filtered.length
        const totalPages = Math.max(1, Math.ceil(total / limit))
        const start = (page - 1) * limit

        const products = filtered.slice(start, start + limit)

        res.render("index", {
            products,
            keyword,
            page,
            limit,
            totalPages,
            total,
            success: req.query.success,
            error: req.query.error
        })
    } catch (err) {
        console.error(err)
        res.status(500).render("error", {
            message: "Không tải được danh sách sản phẩm. Vui lòng thử lại sau."
        })
    }
}

exports.searchProduct = (req, res) => {
    const keyword = (req.query.keyword || "").trim()
    return res.redirect(`/?keyword=${encodeURIComponent(keyword)}`)
}

exports.showAdd = (req, res) => {
    res.render("add", { product: {}, error: null })
}

exports.addProduct = async(req, res) => {
    try {
        const imageUrl = req.file ? .location || ""

        const product = {
            ID: uuidv4(),
            name: (req.body.name || "").trim(),
            price: Number(req.body.price),
            quantity: Number(req.body.quantity),
            image: imageUrl
        }

        await productModel.create(product)

        res.redirect("/?success=" + encodeURIComponent("Thêm sản phẩm thành công."))
    } catch (err) {
        console.error(err)
        if (req.file) {
            await deleteS3Url(req.file.location)
        }
        res.status(500).render("error", {
            message: "Thêm sản phẩm thất bại. Vui lòng thử lại."
        })
    }
}

exports.showEdit = async(req, res) => {
    try {
        const product = await productModel.getById(req.params.id)
        if (!product) {
            return res.status(404).render("error", {
                message: "Không tìm thấy sản phẩm."
            })
        }

        res.render("edit", { product, error: null })
    } catch (err) {
        console.error(err)
        res.status(500).render("error", {
            message: "Không thể tải thông tin sản phẩm. Vui lòng thử lại."
        })
    }
}

exports.updateProduct = async(req, res) => {
    try {
        const id = req.params.id
        const existing = await productModel.getById(id)

        if (!existing) {
            return res.status(404).render("error", {
                message: "Không tìm thấy sản phẩm."
            })
        }

        const newImageUrl = req.file ? req.file.location : req.body.oldImage || existing.image

        if (req.file && existing.image && existing.image !== newImageUrl) {
            await deleteS3Url(existing.image)
        }

        await productModel.update(id, {
            name: (req.body.name || "").trim(),
            price: Number(req.body.price),
            quantity: Number(req.body.quantity),
            image: newImageUrl
        })

        res.redirect("/?success=" + encodeURIComponent("Cập nhật sản phẩm thành công."))
    } catch (err) {
        console.error(err)
        if (req.file) {
            await deleteS3Url(req.file.location)
        }
        res.status(500).render("error", {
            message: "Cập nhật sản phẩm thất bại. Vui lòng thử lại."
        })
    }
}

exports.deleteProduct = async(req, res) => {
    try {
        const product = await productModel.getById(req.params.id)

        if (!product) {
            return res.status(404).render("error", {
                message: "Không tìm thấy sản phẩm."
            })
        }

        if (product.image) {
            await deleteS3Url(product.image)
        }

        await productModel.remove(req.params.id)

        res.redirect("/?success=" + encodeURIComponent("Xóa sản phẩm thành công."))
    } catch (err) {
        console.error(err)
        res.status(500).render("error", {
            message: "Xóa sản phẩm thất bại. Vui lòng thử lại."
        })
    }
}