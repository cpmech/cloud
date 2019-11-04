import { Construct } from '@aws-cdk/core';
import { SqsSubscription } from '@aws-cdk/aws-sns-subscriptions';
import { Topic } from '@aws-cdk/aws-sns';
import { Queue } from '@aws-cdk/aws-sqs';
import { email2key } from '@cpmech/basic';
import { SESDefaultRuleSetConstruct } from '../custom-resources/SESDefaultRuleSetConstruct';

export interface IReceiveEmailProps {
  emails: string[]; // emails
  topicNames?: string[]; // set SNS topic; default is equal to email2key(example@here.com) => example_here_com
}

export class ReceiveEmailSQSConstruct extends Construct {
  readonly topicArns: string[] = [];
  readonly queueUrls: string[] = [];

  constructor(scope: Construct, id: string, props: IReceiveEmailProps) {
    super(scope, id);

    for (let i = 0; i < props.emails.length; i++) {
      const title = props.topicNames ? props.topicNames[i] : email2key(props.emails[i]);
      const topic = new Topic(this, `Topic${i}`, { topicName: title });
      const queue = new Queue(this, `Queue${i}`, { queueName: title });
      topic.addSubscription(new SqsSubscription(queue));
      this.topicArns.push(topic.topicArn);
      this.queueUrls.push(
        `https://sqs.${queue.stack.region}.amazonaws.com/${queue.stack.account}/${title}`,
      );
    }

    new SESDefaultRuleSetConstruct(this, 'DefaultRuleSet', {
      emails: props.emails,
      topicArns: this.topicArns,
    });
  }
}
