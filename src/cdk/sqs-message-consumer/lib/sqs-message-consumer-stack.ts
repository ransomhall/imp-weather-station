import * as cdk from '@aws-cdk/core';
import * as sqs from '@aws-cdk/aws-sqs';
import * as lambda from '@aws-cdk/aws-lambda-nodejs';
import { SqsEventSource } from '@aws-cdk/aws-lambda-event-sources';
import * as logs from '@aws-cdk/aws-logs';
import * as s3 from '@aws-cdk/aws-s3';
export interface SqsMessageConsumerProps extends cdk.StackProps {
  env: {
    account: string;
    region: string;
  };
  appName: string; // stack name and prefix for all resources
}
export class SqsMessageConsumerStack extends cdk.Stack {
  constructor(scope: cdk.Construct, props: SqsMessageConsumerProps) {
    super(scope, props.appName, props);

    const appName = props.appName.toLowerCase();

    // always good to tag stuff
    cdk.Tags.of(this).add('application', appName);

    // SQS Queue
    const queue = new sqs.Queue(this, `SqsQueue`, {
      queueName: `${appName}-sqs-queue`,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    new cdk.CfnOutput(this, 'QueueArn', {
      value: queue.queueArn
    });

    new cdk.CfnOutput(this, 'QueueUrl', {
      value: queue.queueUrl
    });

    //S3 bucket
    const bucket = new s3.Bucket(this, 'Bucket', {
      encryption: s3.BucketEncryption.KMS,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      bucketName: `${appName}-bucket-${props.env.region}`,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL
    });

    new cdk.CfnOutput(this, 'BucketArn', {
      value: bucket.bucketArn
    });

    // Lambda
    const consumer = new lambda.NodejsFunction(this, 'MessageConsumer', {
      functionName: `${appName}-lambda`,
      description:
        'Receives a SQS message and saves WeatherImp data to a S3 bucket.',
      entry: 'lambda/index.ts',
      handler: 'handler',
      logRetention: logs.RetentionDays.THREE_MONTHS,
      logRetentionRetryOptions: {
        maxRetries: 3
      },
      environment: {
        BUCKET_NAME: bucket.bucketName
      }
    });

    // SQS Lambda trigger
    consumer.addEventSource(
      new SqsEventSource(queue, {
        batchSize: 5, // default
        maxBatchingWindow: cdk.Duration.minutes(5)
      })
    );

    new cdk.CfnOutput(this, 'LambdaArn', {
      value: consumer.functionArn
    });

    // grant the lambda role permissions to the bucket
    bucket.grantWrite(consumer);
  }
}
