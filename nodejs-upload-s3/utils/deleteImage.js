const s3 = require("../config/s3")

const deleteImage = async (imageUrl) => {

    const key = imageUrl.split(".amazonaws.com/")[1]

    const params = {
        Bucket: "nodejs-product-images-demo-qbqd",
        Key: key
    }

    await s3.deleteObject(params).promise()
}

module.exports = deleteImage