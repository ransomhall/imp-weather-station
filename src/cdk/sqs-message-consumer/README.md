### sqs-message-comsumer

* Creates an SQS Queue, a Lambda trigger, and a DynamoDB table.
* The SQS message body is a Wunderground API request containing weather data from the WeatherImp station.
* The lambda parses the data into json and saves the request URL and json to the dynamo table.


## Useful commands

 * `npm run build`    compile typescript to js
 * `npm run watch`    watch for changes and compile
 * `npm run prettier` make it look nice
 * `cdk deploy`       deploy this stack to your default AWS account/region
 * `cdk diff`         compare deployed stack with current state
 * `cdk synth`        emits the synthesized CloudFormation template
