require("dotenv").config(); // PHẢI Ở DÒNG ĐẦU

const express = require("express");
const path = require("path");

const app = express();

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Routes
const productRoutes = require("./routes/product.routes");
app.use("/", productRoutes);

// Test env (tạm thời)
console.log("AWS_ACCESS_KEY_ID =", process.env.AWS_ACCESS_KEY_ID);

// Start server
app.listen(3000, () => {
    console.log("Server running on port 3000");
});