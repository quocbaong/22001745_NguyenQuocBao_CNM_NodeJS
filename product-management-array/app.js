const express = require("express");
const app = express();
const path = require("path");
const multer = require("multer");

const productController = require("./controllers/product.controller");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

/* ====== CẤU HÌNH MULTER ====== */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads");
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-" + file.originalname;
        cb(null, uniqueName);
    }
});
const upload = multer({ storage });

/* ====== ROUTES ====== */
app.get("/", productController.list);
app.get("/add", productController.showAddForm);
app.post("/add", upload.single("image"), productController.create);
app.get("/edit/:id", productController.showEditForm);
app.post("/edit/:id", upload.single("image"), productController.update);
app.get("/delete/:id", productController.delete);

app.listen(3000, () => {
    console.log("✅ Server running: http://localhost:3000");
});