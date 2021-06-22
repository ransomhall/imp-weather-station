## WeatherImp
This repository contains various chunks of code related to the data processing for a [Weather Station Wirelessly Connected to Wunderground](https://learn.sparkfun.com/tutorials/weather-station-wirelessly-connected-to-wunderground)


### sqs-message-consumer

The main chunk of work is a [CDK Stack](src/cdk/sqs-message-consumer) that wires up a SQS Queue, Lambda, and DynamoDB table to store the raw data emitted by the weather station. The Electric Imp [Agent code](src/imp/agent.nut) sends SQS messages with the raw data to AWS.

