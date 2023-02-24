import { App } from "aws-cdk-lib";
import { IntegTest } from "@aws-cdk/integ-tests-alpha";
import { InfraStack } from "./stack";

const app = new App();

new IntegTest(app, "Integ", { testCases: [new InfraStack(app, "i")] });

// TODO: Invoke API and assert:
// - response
// - Producer Lambda invocation (and payload?)
// - event put to bus and payload
// - Consumer Lambda invocation

// https://docs.aws.amazon.com/cdk/api/v2/docs/integ-tests-alpha-readme.html

// https://github.com/aws/aws-cdk/tree/main/packages/%40aws-cdk/integ-runner
