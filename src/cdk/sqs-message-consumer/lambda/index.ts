import { URL } from 'url';
const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event: any) => {
  console.log(event);
  for (const item of event.Records) {
    const result = await saveItem(item.body);
    result.then((res: any) => {
      console.log(res);
    });
  }
};

function saveItem(body: any): Promise<any> {
  return new Promise((resolve) => {
    const timestamp = Math.floor(new Date().getTime());
    var parsedJson = parseUrl(body);
    var params = {
      TableName: process.env.TABLE_NAME,
      Item: {
        id: timestamp,
        payload: body,
        weather: parsedJson
      }
    };

    ddb.put(params, function (err: any, data: any) {
      if (err) {
        return err;
      } else {
        return data;
      }
    });
  });
}

// same request is sent to wunderground
function parseUrl(urlString: string): string {
  // url string format will always be the same:
  // https://weatherstation.wunderground.com/weatherstation/updateweatherstation.php?ID=KVTMILTO29&PASSWORD=xx&dateutc=2021-06-22+01%3A14%3A27&winddir=203&windspeedmph=2.9&windgustmph=33.4&windgustdir=315&windspdmph_avg2m=1.6&winddir_avg2m=202&windgustmph_10m=10.2&windgustdir_10m=45&humidity=95.9&tempf=75.8&rainin=0.08&dailyrainin=0.29&baromin=29.5149&dewptf=73.4681&softwaretype=WeatherImp&action=updateraw

  const url = new URL(urlString);

  try {
    const data = {
      dateutc: url.searchParams.get('dateutc')?.toString(),
      winddir: parseInt(url.searchParams.get('winddir')!),
      windspeedmph: parseFloat(url.searchParams.get('windspeedmph')!),
      windgustmph: parseFloat(url.searchParams.get('windgustmph')!),
      windgustdir: parseInt(url.searchParams.get('windgustdir')!),
      windspdmph_avg2m: parseFloat(url.searchParams.get('windspdmph_avg2m')!),
      winddir_avg2m: parseFloat(url.searchParams.get('winddir_avg2m')!),
      windgustmph_10m: parseFloat(url.searchParams.get('windgustmph_10m')!),
      windgustdir_10m: parseInt(url.searchParams.get('windgustdir_10m')!),
      humidity: parseFloat(url.searchParams.get('humidity')!),
      tempf: parseFloat(url.searchParams.get('tempf')!),
      rainin: parseFloat(url.searchParams.get('rainin')!),
      dailyrainin: parseFloat(url.searchParams.get('dailyrainin')!),
      baromin: parseFloat(url.searchParams.get('baromin')!),
      dewptf: parseFloat(url.searchParams.get('dewptf')!)
    };

    const json = JSON.stringify(data);
    console.log(json);
    return json;
  } catch (error) {
    return `Unable to parse url: ${error}`;
  }
}
