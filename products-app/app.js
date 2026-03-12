require("dotenv").config()

const express = require("express")
const bodyParser = require("body-parser")

const app = express()

app.set("view engine", "ejs")

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))

const productRoutes = require("./routes/productRoutes")

app.use("/", productRoutes)

// Error handler for unexpected failures (including upload errors)
app.use((err, req, res, next) => {
    console.error(err)
    const message = err && err.message ? err.message : "Đã xảy ra lỗi máy chủ. Vui lòng thử lại."
    res.status(500).render("error", { message })
})

app.listen(3000, () => {
    console.log("Server running http://localhost:3000")
})