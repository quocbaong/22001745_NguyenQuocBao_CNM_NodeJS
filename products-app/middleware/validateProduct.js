const s3 = require("../config/s3")

const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"]

function getS3KeyFromUrl(url) {
    if (!url) return null
    const parts = url.split(".amazonaws.com/")
    return parts.length === 2 ? parts[1] : null
}

async function deleteUploadedFile(file) {
    if (!file || !file.location) return

    const key = getS3KeyFromUrl(file.location)
    if (!key) return

    await s3
        .deleteObject({
            Bucket: process.env.S3_BUCKET,
            Key: key
        })
        .promise()
}

function validateProduct(mode) {
    return async(req, res, next) => {
        const errors = []

        const name = (req.body.name || "").trim()
        const price = Number(req.body.price)
        const quantity = Number(req.body.quantity)

        if (!name) {
            errors.push("Tên sản phẩm không được để trống.")
        }

        if (Number.isNaN(price) || price <= 0) {
            errors.push("Giá phải lớn hơn 0.")
        }

        if (!Number.isInteger(quantity) || quantity < 0) {
            errors.push("Số lượng phải là số nguyên lớn hơn hoặc bằng 0.")
        }

        if (mode === "add" && !req.file) {
            errors.push("Bạn phải chọn ảnh cho sản phẩm.")
        }

        if (req.file && !allowedMimeTypes.includes(req.file.mimetype)) {
            errors.push("Chỉ chấp nhận file ảnh (JPG, PNG, GIF).")
        }

        if (errors.length > 0) {
            if (req.file) {
                await deleteUploadedFile(req.file)
            }

            const viewData = {
                error: errors.join(" "),
                product: {
                    ID: req.params.id,
                    name,
                    price: !Number.isNaN(price) ? price : "",
                    quantity: !Number.isNaN(quantity) ? quantity : "",
                    image: req.body.oldImage || ""
                }
            }

            return res.status(400).render(mode === "add" ? "add" : "edit", viewData)
        }

        next()
    }
}

module.exports = validateProduct