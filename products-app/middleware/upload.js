const multer = require("multer")
const multerS3 = require("multer-s3")
const s3 = require("../config/s3")

const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"]

function fileFilter(req, file, cb) {
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error("Chỉ chấp nhận file ảnh (JPG/PNG/GIF)."))
    }
}

const upload = multer({

    storage: multerS3({
        s3: s3,
        bucket: process.env.S3_BUCKET,
        contentType: multerS3.AUTO_CONTENT_TYPE,

        key: function(req, file, cb) {

            const filename = Date.now() + "-" + file.originalname

            cb(null, filename)
        }

    }),
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
})

module.exports = upload