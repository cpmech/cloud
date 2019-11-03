import { App, Stack } from '@aws-cdk/core';
import { synthAppString } from '../../helpers/synthApp';
import { DynamoConstruct } from '../DynamoConstruct';

describe('DynamoConstruct ', () => {
  it('synthetizes properly', () => {
    const app = new App();
    const stack = new Stack(app, 'Stack');
    new DynamoConstruct(stack, 'Dynamo', {
      dynamoTables: [
        {
          name: 'PARAMS',
          partitionKey: 'category',
          sortKey: 'key',
        },
        {
          name: 'USERS',
          partitionKey: 'userId',
          sortKey: 'aspect',
        },
      ],
    });
    expect(synthAppString(app)).toMatchSnapshot();
  });
});
