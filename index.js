import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ 
    region: "us-east-1",
});

const ddbDocClient = DynamoDBDocumentClient.from(client);

const updateSession = async (event) => {
    const { from, messages, chatID } = event;
    const { id, first_name, last_name, language_code } = from;
    const command = new PutCommand({
        TableName: "sallySessions",
        Item: {
            sessionID: id.toString(),
            chatID: chatID,
            first_name: first_name,
            last_name: last_name,
            language_code: language_code,
            messages: messages,
            TTL: Math.floor(Date.now() / 1000) + 3600,
        },
        removeUndefinedValues: true,
        removeNullValues: true,
    });
    const response = await ddbDocClient.send(command);
    return response;
}

export { updateSession };