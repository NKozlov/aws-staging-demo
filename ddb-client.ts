// Create service client module using ES6 syntax.
const {DynamoDBClient} = require("@aws-sdk/client-dynamodb");
// Create an Amazon DynamoDB service client object.
const ddbClient = new DynamoDBClient({});
export {ddbClient};