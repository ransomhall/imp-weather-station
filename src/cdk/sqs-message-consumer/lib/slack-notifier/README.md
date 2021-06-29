# Slack Notifier

This stack creates resources to send a slack notification from an SNS message. 
A dummy value is created for the webhook secret, which must be manually updated with the webhook path after deployment (see below). 
Messages are sent via a SNS topic, which is an output of the stack.
A lambda with this SNS trigger sends the notification via a HTTP request.

#### Stack Properties:
* webhookSecretName: name of the secret to store the webhookPath.
* channelName: name of the Slack channel, without the #.
* senderName: name that appears as the user in the slack message
* lambdaNamePrefix: meaningful name prefix so you can more easily reference it. CDK tags on a UID.
* snsTopicName: meaningful name so you can more easily reference it. The stack will create CfnOutput with the topic arn.

#### After Deployment
The secret key `webhookPath` is formatted as follows:

`/services/XXXXXXXXX/YYYYYYYYYYY/ZZZZZZZZZZZZZZZZZZZZZZZZ`

from the Webhook URL created in your Slack App:

`https://hooks.slack.com/services/XXXXXXXXX/YYYYYYYYYYY/ZZZZZZZZZZZZZZZZZZZZZZZZ`

The secret webhookPath value must be updated.
