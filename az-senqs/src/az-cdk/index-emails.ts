import { App, Stack, CfnOutput } from '@aws-cdk/core';
import { Route53ForSendingEmailConstruct, ReceiveEmailSQSConstruct } from '@cpmech/az-cdk';
import { email2key } from '@cpmech/basic';
import { initEnvars } from '@plabs/envars';
import { envars } from './envars';

initEnvars(envars);

const app = new App();

const stackName = 'AZSENQS-testing';
const stack = new Stack(app, stackName);
const email = `tester@${envars.DOMAIN}`;
const topic = email2key(email);

new Route53ForSendingEmailConstruct(stack, 'SendingEmails', {
  domain: envars.DOMAIN,
  hostedZoneId: envars.HOSTED_ZONE_ID,
  certificateArn: envars.CERTIFICATE_ARN,
});

new ReceiveEmailSQSConstruct(stack, 'EmailSQS', {
  emails: [email],
});

new CfnOutput(stack, 'QueueUrl', {
  value: `https://sqs.us-east-1.amazonaws.com/${stack.account}/${topic}`,
});
