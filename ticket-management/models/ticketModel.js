const { dynamoDB } = require("../config/aws");
const {
    ScanCommand,
    GetCommand,
    PutCommand,
    UpdateCommand,
    DeleteCommand
} = require("@aws-sdk/lib-dynamodb");

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || "EventTickets";
const PK = "ticketId";

const normalizeItem = (item) => {
    if (!item) return null;
    return item;
};

module.exports = {
    getAll: async (filter = {}) => {
        const params = { TableName: TABLE_NAME };
        
        // Status filter can stay in DynamoDB as it's usually exact match
        if (filter.status) {
            params.FilterExpression = "#status = :status";
            params.ExpressionAttributeValues = { ":status": filter.status };
            params.ExpressionAttributeNames = { "#status": "status" };
        }

        const data = await dynamoDB.send(new ScanCommand(params));
        let items = data.Items || [];

        // Case-insensitive search filter in-memory
        if (filter.search) {
            const searchLower = filter.search.toLowerCase();
            items = items.filter(item => 
                (item.eventName && item.eventName.toLowerCase().includes(searchLower)) ||
                (item.holderName && item.holderName.toLowerCase().includes(searchLower))
            );
        }

        return items.map(normalizeItem);
    },

    getById: async (id) => {
        const data = await dynamoDB.send(
            new GetCommand({
                TableName: TABLE_NAME,
                Key: { [PK]: id }
            })
        );
        return normalizeItem(data.Item);
    },

    create: async (ticket) => {
        return dynamoDB.send(
            new PutCommand({
                TableName: TABLE_NAME,
                Item: ticket
            })
        );
    },

    update: async (id, ticket) => {
        return dynamoDB.send(
            new UpdateCommand({
                TableName: TABLE_NAME,
                Key: { [PK]: id },
                UpdateExpression: "set eventName = :eventName, holderName = :holderName, category = :category, quantity = :quantity, pricePerTicket = :pricePerTicket, eventDate = :eventDate, #status = :status, totalAmount = :totalAmount, finalAmount = :finalAmount, isDiscounted = :isDiscounted, imageUrl = :imageUrl",
                ExpressionAttributeNames: {
                    "#status": "status"
                },
                ExpressionAttributeValues: {
                    ":eventName": ticket.eventName,
                    ":holderName": ticket.holderName,
                    ":category": ticket.category,
                    ":quantity": ticket.quantity,
                    ":pricePerTicket": ticket.pricePerTicket,
                    ":eventDate": ticket.eventDate,
                    ":status": ticket.status,
                    ":totalAmount": ticket.totalAmount,
                    ":finalAmount": ticket.finalAmount,
                    ":isDiscounted": ticket.isDiscounted,
                    ":imageUrl": ticket.imageUrl
                }
            })
        );
    },

    delete: async (id) => {
        return dynamoDB.send(
            new DeleteCommand({
                TableName: TABLE_NAME,
                Key: { [PK]: id }
            })
        );
    }
};