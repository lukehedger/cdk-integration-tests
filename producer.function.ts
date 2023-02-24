import {
  EventBridgeClient,
  PutEventsCommand,
} from "@aws-sdk/client-eventbridge";
import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from "aws-lambda";

const eventbridge = new EventBridgeClient({ region: process.env.AWS_REGION });

export const handler: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2
) => {
  const putEventsCommand = new PutEventsCommand({
    Entries: [
      {
        Detail: JSON.stringify({
          message: "Hello from the producer",
        }),
        DetailType: "Tested",
        EventBusName: process.env.EVENT_BUS_NAME,
        Source: process.env.AWS_LAMBDA_FUNCTION_NAME,
      },
    ],
  });

  await eventbridge.send(putEventsCommand);

  return {
    statusCode: 200,
    headers: { "Content-Type": "text/plain" },
    body: `Your request was received at ${event.requestContext.time}`,
  };
};
