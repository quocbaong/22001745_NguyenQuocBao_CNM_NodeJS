const { dynamoDB } = require('../config/aws');

const {
    ScanCommand,
    GetCommand,
    PutCommand,
    UpdateCommand,
    DeleteCommand
} = require("@aws-sdk/lib-dynamodb");

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || "Products";
const PK = "ID";

const normalizeItem = (item) => {
    if (!item) return null;
    const {
        [PK]: pkId, id: legacyId, ...rest } = item;
    return { id: pkId ?? legacyId, ...rest };
};

module.exports = {

    getAll: async() => {
        const data = await dynamoDB.send(
            new ScanCommand({ TableName: TABLE_NAME })
        );
        return (data.Items || []).map(normalizeItem);
    },

    getById: async(id) => {
        const data = await dynamoDB.send(
            new GetCommand({
                TableName: TABLE_NAME,
                Key: {
                    [PK]: id }
            })
        );
        return normalizeItem(data.Item);
    },

    create: async(product) => {
        const item = {...product, [PK]: product.id || product.ID };
        return dynamoDB.send(
            new PutCommand({
                TableName: TABLE_NAME,
                Item: item
            })
        );
    },

    update: async(id, product) => {
        return dynamoDB.send(
            new UpdateCommand({
                TableName: TABLE_NAME,
                Key: {
                    [PK]: id },
                UpdateExpression: "set #n = :name, price = :price, unit_in_stock = :stock, url_image = :img",
                ExpressionAttributeNames: {
                    "#n": "name"
                },
                ExpressionAttributeValues: {
                    ":name": product.name,
                    ":price": product.price,
                    ":stock": product.unit_in_stock,
                    ":img": product.url_image
                }
            })
        );
    },

    delete: async(id) => {
        return dynamoDB.send(
            new DeleteCommand({
                TableName: TABLE_NAME,
                Key: {
                    [PK]: id }
            })
        );
    }

};