import { Construct } from '@aws-cdk/core';
import { Pipeline } from '@aws-cdk/aws-codepipeline';
import { Topic } from '@aws-cdk/aws-sns';
import { EventField, RuleTargetInput } from '@aws-cdk/aws-events';
import { SnsTopic } from '@aws-cdk/aws-events-targets';
import { EmailSubscription } from '@aws-cdk/aws-sns-subscriptions';

export interface IPipelineNotificationProps {
  topicName: string; // notification topic name
  emails: string[]; // email addresses to get notifications
  pipeline: Pipeline; // the pipeline
}

export class PipelineNotificationConstruct extends Construct {
  constructor(scope: Construct, id: string, props: IPipelineNotificationProps) {
    super(scope, id);

    const topic = new Topic(this, 'Topic', {
      topicName: props.topicName,
    });

    props.emails.forEach(email => {
      topic.addSubscription(new EmailSubscription(email));
    });

    const ePipeline = EventField.fromPath('$.detail.pipeline');
    const eState = EventField.fromPath('$.detail.state');

    props.pipeline.onStateChange('OnPipelineStateChange', {
      eventPattern: {
        detail: {
          state: ['STARTED', 'FAILED', 'SUCCEEDED'],
        },
      },
      target: new SnsTopic(topic, {
        message: RuleTargetInput.fromText(`Pipeline ${ePipeline} changed state to ${eState}`),
      }),
    });
  }
}
