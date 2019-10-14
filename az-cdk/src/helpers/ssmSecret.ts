import { SecretValue, CfnDynamicReference, CfnDynamicReferenceService } from '@aws-cdk/core';

// ssmSecret creates a reference to a parameter in the SSM Parameter Store (not Secrets Manager!)
export const ssmSecret = (input: { name: string; version: string }): SecretValue => {
  return SecretValue.cfnDynamicReference(
    new CfnDynamicReference(CfnDynamicReferenceService.SSM, `${input.name}:${input.version}`),
  );
};
