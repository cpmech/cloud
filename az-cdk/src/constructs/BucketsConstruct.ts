import { Construct, RemovalPolicy } from '@aws-cdk/core';
import { Bucket, HttpMethods, CorsRule } from '@aws-cdk/aws-s3';

export interface IBucketParams {
  name: string;
  corsGET?: boolean;
  corsPUT?: boolean;
  corsPOST?: boolean;
  corsDELETE?: boolean;
}

export interface IBucketsProps {
  buckets: IBucketParams[];
}

export class BucketsConstruct extends Construct {
  readonly buckets: Bucket[] = [];

  constructor(scope: Construct, id: string, props: IBucketsProps) {
    super(scope, id);

    props.buckets.forEach((b, i) => {
      let cors: CorsRule[] | undefined = undefined;
      if (b.corsGET || b.corsPUT || b.corsPOST || b.corsDELETE) {
        const allowedMethods: HttpMethods[] = [];
        if (b.corsGET) {
          allowedMethods.push(HttpMethods.GET);
        }
        if (b.corsPUT) {
          allowedMethods.push(HttpMethods.PUT);
        }
        if (b.corsPOST) {
          allowedMethods.push(HttpMethods.POST);
        }
        if (b.corsDELETE) {
          allowedMethods.push(HttpMethods.DELETE);
        }
        cors = [
          {
            allowedOrigins: ['*'],
            allowedHeaders: ['*'],
            allowedMethods,
          },
        ];
      }

      const bucket = new Bucket(this, `Bucket${i}`, {
        bucketName: b.name,
        removalPolicy: RemovalPolicy.DESTROY,
        cors,
      });

      this.buckets.push(bucket);
    });
  }
}
