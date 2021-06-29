import { SlackRequest } from "./slack";

const AWS = require('aws-sdk');
const secretsManager = new AWS.SecretsManager({});

export const handler = async (event: any = {}): Promise<any> => {

	let [error, secret] = await getAwsSecretAsync(process.env.WEBHOOK_SECRET_NAME);
	if (error) {
		console.error(error);
		return;
	}

	let webhookPath = JSON.parse(secret).webhookPath;
	const slack = new SlackRequest(webhookPath);
	const message = JSON.stringify(event.Records[0].Sns.Message, null, 2);

	let senderName = process.env.SENDER_NAME || 'slack-notifier';

	var slackResponse = await slack.sendMessage(message, senderName);

	var functionResponse = {
		message: message,
		status_code: slackResponse.statusCode,
		response: slackResponse.responseBody
	};

	console.log(JSON.stringify(functionResponse, null, 2));
	return functionResponse;
}

async function getAwsSecretAsync (secretName?: string) {
	var error;
	var response = await getAwsSecret(secretName).catch((err: any) => (error = err));
	return [error, response.SecretString];
}

function getAwsSecret(secretName?: string) {
	return secretsManager.getSecretValue({ SecretId: secretName }).promise();
}
  