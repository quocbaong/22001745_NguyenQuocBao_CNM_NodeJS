const dynamoDB = require("../config/dynamo")

const TABLE = process.env.DYNAMODB_TABLE || "Products"

async function scanAll() {
    const data = await dynamoDB
        .scan({
            TableName: TABLE
        })
        .promise()

    return data.Items || []
}

async function getById(id) {
    if (!id) return null

    const data = await dynamoDB
        .get({
            TableName: TABLE,
            Key: { ID: id }
        })
        .promise()

    return data.Item
}

async function create(product) {
    await dynamoDB
        .put({
            TableName: TABLE,
            Item: product
        })
        .promise()

    return product
}

async function update(id, { name, price, quantity, image }) {
    const updateExpression = [
        "#n = :name",
        "price = :price",
        "quantity = :quantity",
        "image = :image"
    ]

    await dynamoDB
        .update({
            TableName: TABLE,
            Key: { ID: id },
            UpdateExpression: `set ${updateExpression.join(", ")}`,
            ExpressionAttributeNames: { "#n": "name" },
            ExpressionAttributeValues: {
                ":name": name,
                ":price": price,
                ":quantity": quantity,
                ":image": image
            }
        })
        .promise()

    return getById(id)
}

async function remove(id) {
    await dynamoDB
        .delete({
            TableName: TABLE,
            Key: { ID: id }
        })
        .promise()
}

module.exports = {
    scanAll,
    getById,
    create,
    update,
    remove
}