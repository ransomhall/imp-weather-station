#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import {
  SqsMessageConsumerProps,
  SqsMessageConsumerStack
} from '../lib/sqs-message-consumer-stack';
import { SlackNotiferStack, SlackNotifierStackProps } from '../lib/slack-notifier/slack-notifier-stack';

const app = new cdk.App();

const props: SqsMessageConsumerProps = {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT!,
    region: process.env.CDK_DEFAULT_REGION!
  },
  appName: 'weatherimp-data'
};

new SqsMessageConsumerStack(app, props);

const slackProps: SlackNotifierStackProps = {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT!,
    region: process.env.CDK_DEFAULT_REGION!
  },
  appName: 'vtiot-slack-notifier',
  webhookSecretName: 'vtiot/slack-notifier-webhook',
  channelName: 'aws-notifications',
  senderName: 'vtiot',
  snsTopicName: 'vtiot-slack-notifications'
};

new SlackNotiferStack(app, slackProps);

app.synth();
