require('dotenv').config();

const { S3Client } = require("@aws-sdk/client-s3");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");

const config = {
    region: process.env.AWS_REGION
};

const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
if (accessKeyId && secretAccessKey) {
    config.credentials = {
        accessKeyId,
        secretAccessKey
    };
}

const s3 = new S3Client(config);

const client = new DynamoDBClient(config);
const dynamoDB = DynamoDBDocumentClient.from(client);

module.exports = { s3, dynamoDB };