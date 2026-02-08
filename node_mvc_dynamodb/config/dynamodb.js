const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");
require("dotenv").config();

const REGION = process.env.AWS_REGION || "us-west-2";
const endpoint = process.env.DYNAMODB_ENDPOINT;

const client = new DynamoDBClient({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "local",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "local",
  },
  ...(endpoint ? { endpoint } : {}),
});

const ddbDocClient = DynamoDBDocumentClient.from(client);

module.exports = { client, ddbDocClient };
