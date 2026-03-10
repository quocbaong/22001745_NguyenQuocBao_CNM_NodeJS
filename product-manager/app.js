require("dotenv").config()

const express = require("express")
const bodyParser = require("body-parser")

const app = express()

app.set("view engine","ejs")

app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))

const productRoutes = require("./routes/productRoutes")

app.use("/",productRoutes)

app.listen(3000,()=>{
 console.log("Server running http://localhost:3000")
})