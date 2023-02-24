import { App } from "aws-cdk-lib";
import { InfraStack } from "./stack";

new InfraStack(new App(), "cdk-integration-tests");
