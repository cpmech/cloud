import { Construct, RemovalPolicy } from '@aws-cdk/core';
import { Bucket } from '@aws-cdk/aws-s3';

export interface IBucketsProps {
  bucketNames: string[];
}

export class BucketsConstruct extends Construct {
  readonly buckets: Bucket[] = [];

  constructor(scope: Construct, id: string, props: IBucketsProps) {
    super(scope, id);

    props.bucketNames.forEach((bucketName, i) => {
      const bucket = new Bucket(this, `Bucket${i}`, {
        bucketName,
        removalPolicy: RemovalPolicy.DESTROY,
      });
      this.buckets.push(bucket);
    });
  }
}
