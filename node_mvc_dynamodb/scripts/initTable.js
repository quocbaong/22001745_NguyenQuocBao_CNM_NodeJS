const { client } = require("../config/dynamodb");
const { CreateTableCommand, ListTablesCommand } = require("@aws-sdk/client-dynamodb");
const tableName = "Products";

async function ensureTable() {
  const tables = await client.send(new ListTablesCommand({}));
  if ((tables.TableNames || []).includes(tableName)) {
    console.log(`${tableName} already exists`);
    return;
  }

  const params = {
    TableName: tableName,
    AttributeDefinitions: [
      { AttributeName: "id", AttributeType: "S" },
    ],
    KeySchema: [
      { AttributeName: "id", KeyType: "HASH" },
    ],
    BillingMode: "PAY_PER_REQUEST",
  };

  try {
    await client.send(new CreateTableCommand(params));
    console.log(`Created table ${tableName}`);
  } catch (err) {
    console.error("Error creating table:", err);
    process.exit(1);
  }
}

ensureTable();
