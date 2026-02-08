const express = require("express");
const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const productRoutes = require("./routes/productRoutes");
const path = require("path");
require("dotenv").config();

app.use(express.static(path.join(__dirname, "public")));
app.use("/products", productRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
