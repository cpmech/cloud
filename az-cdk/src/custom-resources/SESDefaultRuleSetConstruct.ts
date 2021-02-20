import { Construct, Duration } from '@aws-cdk/core';
import { Function, Code, Runtime } from '@aws-cdk/aws-lambda';
import { CustomResource, CustomResourceProvider } from '@aws-cdk/aws-cloudformation';
import { PolicyStatement } from '@aws-cdk/aws-iam';
import { crlDir } from './crlDir';
import { defaults } from '../defaults';

export interface ISESDefaultRuleSetProps {
  emails: string[];
  topicArns: string[];
  runtime?: Runtime; // see defaults.runtime
}

export class SESDefaultRuleSetConstruct extends Construct {
  constructor(scope: Construct, id: string, props: ISESDefaultRuleSetProps) {
    super(scope, id);

    const fcn = new Function(this, 'Function', {
      code: Code.fromAsset(crlDir),
      handler: 'index.sesDefaultRuleSet',
      runtime: props.runtime || defaults.runtime,
      timeout: Duration.minutes(1),
    });

    const actions = [
      'ses:CreateReceiptRule',
      'ses:CreateReceiptRuleSet',
      'ses:DeleteReceiptRule',
      'ses:DeleteReceiptRuleSet',
      'ses:DescribeActiveReceiptRuleSet',
      'ses:DescribeReceiptRuleSet',
      'ses:ListReceiptRuleSets',
      'ses:SetActiveReceiptRuleSet',
      'ses:UpdateReceiptRule',
    ];

    actions.forEach((action) => {
      fcn.addToRolePolicy(
        new PolicyStatement({
          actions: [action],
          resources: ['*'],
        }),
      );
    });

    new CustomResource(this, 'Resource', {
      provider: CustomResourceProvider.lambda(fcn),
      properties: {
        Emails: props.emails,
        TopicArns: props.topicArns,
      },
    });
  }
}
