const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/productController");

router.get("/", ctrl.index);
router.get("/add", ctrl.createForm);
router.post("/add", ctrl.create);
router.get("/edit/:id", ctrl.editForm);
router.post("/edit/:id", ctrl.update);
router.post("/delete/:id", ctrl.remove);

module.exports = router;
