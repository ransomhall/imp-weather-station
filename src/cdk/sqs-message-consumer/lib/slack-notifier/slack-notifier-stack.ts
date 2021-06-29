import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import * as sns from '@aws-cdk/aws-sns';
import {Runtime} from '@aws-cdk/aws-lambda';
import {NodejsFunction} from '@aws-cdk/aws-lambda-nodejs';
import * as lambdaSources from '@aws-cdk/aws-lambda-event-sources';

export interface SlackNotifierStackProps extends cdk.StackProps {
    env:{
        account: string,
        region: string
    }
    appName: string;
    webhookSecretName: string;
    channelName: string;
    senderName: string;
    snsTopicName: string;
}

export class SlackNotiferStack extends cdk.Stack {
    constructor(scope: cdk.Construct, props: SlackNotifierStackProps) {
        super(scope, `${props.appName}`);
        
        const secret = new secretsmanager.Secret(this, 'SlackWebhookSecret', {
            secretName: props.webhookSecretName,
            generateSecretString: {
                secretStringTemplate: JSON.stringify({ channel: props.channelName }),
                generateStringKey: 'webhookPath'
            }
        });
  
        const role = new iam.Role(this, 'SlackLambdaRole', {
            roleName: `${props.appName}-lambda-role`,
            assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
        });

        // Messages published to this SNS topic will be sent to Slack
        const topic = new sns.Topic(this, 'SlackSnsTopic', {
          topicName: props.snsTopicName
        });

        new cdk.CfnOutput(this, `SlackSnsTopicArn`, {
          value: topic.topicArn
        });

        // Required for Lambda execution
        role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaBasicExecutionRole"));

        role.addToPolicy(
            new iam.PolicyStatement({
                effect: iam.Effect.ALLOW,
                actions: [
                    'secretsmanager:GetResourcePolicy',
                    'secretsmanager:GetSecretValue',
                    'secretsmanager:DescribeSecret',
                    'secretsmanager:ListSecretVersionIds',
                    'secretsmanager:ListSecrets',
                ],
                resources: [`arn:aws:secretsmanager:${props.env.region}:${props.env.account}:secret:*`],
            }),
        );

        // Slack notification lambda
        const slackLambda = new NodejsFunction(this, `${props.appName}-lambda`, {
            functionName: `${props.appName}-lambda`,
            runtime: Runtime.NODEJS_14_X,
            handler: 'handler',
            entry: 'lib/slack-notifier/lambda/lambda.ts',
            environment: {
                WEBHOOK_SECRET_NAME: props.webhookSecretName,
                CHANNEL_NAME: props.channelName,
                SENDER_NAME: props.senderName
            },
            role: role
        });

        // Configure the SNS topic as an event source for the lambda
        const eventSource = slackLambda.addEventSource(new lambdaSources.SnsEventSource(topic));
    }
}