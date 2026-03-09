require("dotenv").config()

const express = require("express")
const app = express()

const productRoutes = require("./routes/product")

app.set("view engine", "ejs")   // thêm dòng này

app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))

app.use("/", productRoutes)

app.listen(3000, () => {
    console.log("Server running on port 3000")
})