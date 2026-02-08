const { ddbDocClient } = require("../config/dynamodb");
const { PutCommand, GetCommand, DeleteCommand, ScanCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");
const TABLE = "Products";

async function createProduct(item) {
  await ddbDocClient.send(new PutCommand({ TableName: TABLE, Item: item }));
  return item;
}

async function getProduct(id) {
  const res = await ddbDocClient.send(new GetCommand({ TableName: TABLE, Key: { id } }));
  return res.Item;
}

async function deleteProduct(id) {
  await ddbDocClient.send(new DeleteCommand({ TableName: TABLE, Key: { id } }));
}

async function listProducts() {
  const res = await ddbDocClient.send(new ScanCommand({ TableName: TABLE }));
  return res.Items || [];
}

async function updateProduct(id, attrs) {
  const Expression = [];
  const ExpressionAttributeValues = {};
  const ExpressionAttributeNames = {};
  let idx = 0;
  for (const k of Object.keys(attrs)) {
    idx++;
    const nameKey = `#k${idx}`;
    const valKey = `:v${idx}`;
    Expression.push(`${nameKey} = ${valKey}`);
    ExpressionAttributeNames[nameKey] = k;
    ExpressionAttributeValues[valKey] = attrs[k];
  }
  const UpdateExpression = "SET " + Expression.join(", ");

  const res = await ddbDocClient.send(new UpdateCommand({
    TableName: TABLE,
    Key: { id },
    UpdateExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    ReturnValues: "ALL_NEW",
  }));
  return res.Attributes;
}

module.exports = { createProduct, getProduct, deleteProduct, listProducts, updateProduct };
