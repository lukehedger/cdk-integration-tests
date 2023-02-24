import path from "path";
import { App, Stack, StackProps } from "aws-cdk-lib";
import { HttpLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import { HttpApi, HttpMethod } from "@aws-cdk/aws-apigatewayv2-alpha";
import { EventBus, Rule } from "aws-cdk-lib/aws-events";
import { LambdaFunction } from "aws-cdk-lib/aws-events-targets";
import { Architecture, Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

export const InfraStack = class InfraStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const eventBus = new EventBus(this, "EventBus");

    const httpApi = new HttpApi(this, "HttpApi");

    httpApi.addRoutes({
      path: "/",
      methods: [HttpMethod.POST],
      integration: new HttpLambdaIntegration(
        "LambdaIntegration",
        new NodejsFunction(this, "ProducerFunction", {
          architecture: Architecture.ARM_64,
          entry: path.join(__dirname, "/producer.function.ts"),
          environment: {
            EVENT_BUS_NAME: eventBus.eventBusName,
          },
          runtime: Runtime.NODEJS_18_X,
        })
      ),
    });

    const consumerFunction = new NodejsFunction(this, "ConsumerFunction", {
      architecture: Architecture.ARM_64,
      entry: path.join(__dirname, "/consumer.function.ts"),
      runtime: Runtime.NODEJS_18_X,
    });

    new Rule(this, "PaymentAuthorisedEventWorkflowExecutionRule", {
      eventBus: eventBus,
      eventPattern: {
        detailType: ["Tested"],
      },
      targets: [new LambdaFunction(consumerFunction)],
    });
  }
};
