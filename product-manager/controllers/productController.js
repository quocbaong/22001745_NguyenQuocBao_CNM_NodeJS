const dynamoDB = require("../config/dynamo")
const s3 = require("../config/s3")
const { v4: uuidv4} = require("uuid")

const TABLE = "Products"

exports.getAllProducts  = async (req, res) => {
    const data = await dynamoDB.scan({
        TableName: TABLE
    }).promise()

    res.render("index", {products: data.Items})
}

exports.searchProduct = async (req, res) => {
    const keyword = req.query.keyword.toLowerCase()


    const data = await dynamoDB.scan({
        TableName: TABLE
    }).promise()

    const result = data.Items.filter(p=>
        p.name.toLowerCase().includes(keyword)
    )

    res.render("index", {products:result})
}

exports.showAdd = (req, res) => {
    res.render("add")
}

exports.addProduct = async (req,res)=>{

 const imageUrl = req.file.location

 const product = {
  ID: uuidv4(),
  name: req.body.name,
  price: Number(req.body.price),
  quantity: Number(req.body.quantity),
  image: imageUrl
 }

 await dynamoDB.put({
  TableName: TABLE,
  Item: product
 }).promise()

 res.redirect("/")
}

exports.showEdit = async (req,res)=>{

 const data = await dynamoDB.get({
  TableName: TABLE,
  Key:{ID:req.params.id}
 }).promise()

 res.render("edit",{product:data.Item})
}


exports.updateProduct = async (req,res)=>{

 const id = req.params.id

 let imageUrl = req.body.oldImage

 if(req.file){

  imageUrl = req.file.location

 }

 await dynamoDB.update({

  TableName: TABLE,
  Key:{ID:id},

  UpdateExpression:
  "set #n=:name, price=:price, quantity=:quantity, image=:image",

  ExpressionAttributeNames:{
   "#n":"name"
  },

  ExpressionAttributeValues:{
   ":name":req.body.name,
   ":price":Number(req.body.price),
   ":quantity":Number(req.body.quantity),
   ":image":imageUrl
  }

 }).promise()

 res.redirect("/")
}


exports.deleteProduct = async (req,res)=>{

 const data = await dynamoDB.get({
  TableName: TABLE,
  Key:{ID:req.params.id}
 }).promise()

 const imageUrl = data.Item.image

 const key = imageUrl.split(".amazonaws.com/")[1]

 await s3.deleteObject({
  Bucket:process.env.S3_BUCKET,
  Key:key
 }).promise()

 await dynamoDB.delete({
  TableName: TABLE,
  Key:{ID:req.params.id}
 }).promise()

 res.redirect("/")
}