const express = require('express');
const router = express.Router();
const controller = require('../controllers/productController');

const multer = require('multer');
const multerS3 = require('multer-s3');
const { s3 } = require('../config/aws');

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.S3_BUCKET_NAME,
        key: (req, file, cb) => {
            cb(null, Date.now() + "_" + file.originalname);
        }
    })
});

router.get('/', controller.index);

router.get('/add', controller.showAdd);
router.post('/add', upload.single('image'), controller.create);

router.get('/edit/:id', controller.showEdit);
router.post('/edit/:id', upload.single('image'), controller.update);

router.get('/delete/:id', controller.delete);
router.get('/detail/:id', controller.detail);

module.exports = router;