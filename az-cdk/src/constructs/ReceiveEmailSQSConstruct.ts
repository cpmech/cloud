import { Construct } from '@aws-cdk/core';
import { SqsSubscription } from '@aws-cdk/aws-sns-subscriptions';
import { Topic } from '@aws-cdk/aws-sns';
import { Queue } from '@aws-cdk/aws-sqs';
import { email2key } from '@cpmech/basic';
import { SESDefaultRuleSetConstruct } from '../custom-resources/SESDefaultRuleSetConstruct';

export interface IReceiveEmailProps {
  emails: string[];
  dropSpam?: boolean;
}

export class ReceiveEmailSQSConstruct extends Construct {
  constructor(scope: Construct, id: string, props: IReceiveEmailProps) {
    super(scope, id);

    const topicArns: string[] = [];
    let i = 0;
    for (const email of props.emails) {
      const title = email2key(email);
      const topic = new Topic(this, `Topic${i}`, { topicName: title });
      const queue = new Queue(this, `Queue${i}`, { queueName: title });
      topic.addSubscription(new SqsSubscription(queue));
      topicArns.push(topic.topicArn);
      i++;
    }

    new SESDefaultRuleSetConstruct(this, 'DefaultRuleSet', {
      emails: props.emails,
      topicArns,
    });
  }
}
