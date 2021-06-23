#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import {
  SqsMessageConsumerProps,
  SqsMessageConsumerStack
} from '../lib/sqs-message-consumer-stack';

const app = new cdk.App();

const props: SqsMessageConsumerProps = {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT!,
    region: process.env.CDK_DEFAULT_REGION!
  },
  appName: 'weatherimp-data'
};

new SqsMessageConsumerStack(app, props);

app.synth();
