const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");
const { v4: uuidv4 } = require("uuid");

const REGION = process.env.AWS_REGION;
const TABLE = process.env.TODO_TABLE;

const client = new DynamoDBClient({
  region: REGION
});

const db = DynamoDBDocumentClient.from(client);

// Lấy danh sách todos
exports.listTodos = async () => {
  const data = await db.send(
    new ScanCommand({
      TableName: TABLE
    })
  );

  return data.Items || [];
};

// Thêm todo mới
exports.addTodo = async (title) => {
  const item = {
    todoId: uuidv4(),
    title: title
  };

  await db.send(
    new PutCommand({
      TableName: TABLE,
      Item: item
    })
  );
};