const multer = require("multer")
const multerS3 = require("multer-s3")
const s3 = require("../config/s3")

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.S3_BUCKET,
        acl: "public-read",
        key: function(req, file, cb) {
            const filename = Date.now() + "-" + file.originalname
            cb(null, filename)
        }
    })
})

module.exports = upload