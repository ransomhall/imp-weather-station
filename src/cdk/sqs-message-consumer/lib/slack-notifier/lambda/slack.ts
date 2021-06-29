import { asyncHttpsRequest, HttpsResponse } from "./async-request";

export class SlackRequest {

    private webhookPath: string;

    constructor(webhookPath: string) {
        this.webhookPath = webhookPath;
    }

    public async sendMessage(message: string, senderName: string): Promise<HttpsResponse> {
        
        if(this.webhookPath == 'undefined'){
            throw 'No webhook path provided.';
        }

        const payload = JSON.stringify({
            text: message,
            userName: senderName,
            channel: process.env.CHANNEL_NAME
        })
        
        const options = {
            hostname: 'hooks.slack.com',
            method: 'POST',
            path: this.webhookPath,
            port: 443,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': payload.length
              }
        };

        console.log(`Sending message: ${payload}`);
        return await asyncHttpsRequest(options, payload);
    }
}