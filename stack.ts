import { App, Stack, StackProps } from "aws-cdk-lib";

export const InfraStack = class InfraStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    // resources go here
  }
};
