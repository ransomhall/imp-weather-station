## WeatherImp Weather Station Application
This repository contains various chunks of code related to the data processing for a [Weather Station Wirelessly Connected to Wunderground](https://learn.sparkfun.com/tutorials/weather-station-wirelessly-connected-to-wunderground)


### CDK Stacks
#### sqs-message-consumer

The main chunk of work is a [CDK Stack](src/cdk/sqs-message-consumer) that wires up a SQS Queue, Lambda, and DynamoDB table to store the raw data emitted by the weather station. The Electric Imp [Agent code](src/imp/agent.nut) sends SQS messages with the raw data to AWS.
#### slack-notifier

This [stack](src/cdk/sqs-message-consumer/lib/slack-notifier/slack-notifier-stack.ts) creates a SNS topic with a lambda trigger that sends the body of the message to Slack. See the [readme](src/cdk/sqs-message-consumer/lib/slack-notifier/README.md) for details.

### Electric Imp

The weather station uses and [ElectricImp](https://www.electricimp.com/platform/how-it-works/) WiFi device to upload data. The [Agent](src/imp/agent.nut) and [Device](src/imp/device.nut) squirrel code (yes, it's a legit [programming language](https://en.wikipedia.org/wiki/Squirrel_(programming_language))) files are copied from the Imp dev platform for safe keeping here. There is no automated Github deployment mechanism, so we just have to copy and paste when updates are made.
