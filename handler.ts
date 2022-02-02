import {ddbClient} from "./ddb-client"
import {GetItemCommandInput} from "@aws-sdk/client-dynamodb/dist-types/commands/GetItemCommand";
import {ScanCommand, ScanCommandInput, ScanCommandOutput} from "@aws-sdk/client-dynamodb";

const {PutItemCommand, GetItemCommand} = require("@aws-sdk/client-dynamodb");

// @ts-ignore
module.exports.run = async (event) => {
    console.log("event: ", event)
    console.log("Environment variable 'DDB_TABLE' is '" + process.env.DDB_TABLE + "'")
    const tableName = process.env.DDB_TABLE
    let lambdaResponse
    if (event.requestContext.http.method === "GET") {

        if (event.rawQueryString === "") {
            // Scan
            const scanCommandInput: ScanCommandInput = {
                TableName: tableName
            }
            const scanCommand: ScanCommand = new ScanCommand(scanCommandInput)
            console.log("Command: ", scanCommand)
            const response: ScanCommandOutput = await ddbClient.send(scanCommand)
            console.log("Response: ", JSON.stringify(response))
            lambdaResponse = response;
        } else {
            // GetItem
            let authorParam: string = ""
            if (event.queryStringParameters !== undefined && event.queryStringParameters.author !== undefined) {
                authorParam = event.queryStringParameters?.author
            }
            const inputGetCommand: GetItemCommandInput = {
                TableName: tableName,
                Key: {
                    Author: {S: authorParam}
                }
            }
            const readItemCommand = new GetItemCommand(inputGetCommand)
            console.log("Command: ", readItemCommand)
            const response = await ddbClient.send(readItemCommand)
            console.log("Response: ", JSON.stringify(response))
            lambdaResponse = response;
        }
    } else {
        const requestParams: ImageDescriptionRecord = JSON.parse(event.body)
        console.log("Request params is ", requestParams)
        // PutItem
        const params = {
            TableName: tableName,
            Item: {
                Author: {S: requestParams.Author},
                DATE: {S: requestParams.DATE},
            },
        };

        try {
            const putCommand = new PutItemCommand(params)
            console.log("Command: ", JSON.stringify(putCommand))
            const response = await ddbClient.send(putCommand);
            console.log("Response: ", JSON.stringify(response));
            lambdaResponse = response;
        } catch (err) {
            console.error(err)
            lambdaResponse = err;
        }
    }

    return {
        statusCode: 200,
        body: JSON.stringify(
                {
                    message: 'Go Serverless v1.0! Your function executed successfully!',
                    input: event,
                    lambdaResponse
                },
                null,
                2
        ),
    };

    // Use this code if you don't use the http event with the LAMBDA-PROXY integration
    // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

export class ImageDescriptionRecord {
    Author: string
    DATE: string
}


