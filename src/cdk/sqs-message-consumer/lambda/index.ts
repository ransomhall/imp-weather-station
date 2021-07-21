import { URL } from 'url';
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const appName = 'weather-imp';
const deviceId = 'hall-homestead';

exports.handler = async (event: any) => {
  console.log(event);
  for (const item of event.Records) {
    await saveItemToS3(item.body, getKey());
  }
};

function saveItemToS3(body: any, key: string): Promise<any> {
  return new Promise((resolve) => {
    const parsedJson = parseUrl(body);
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: key,
      Body: parsedJson,
      ContentType: 'application/json',
    };

    s3.putObject(params, function (err: any, data: any) {
      if (err) {
        console.log(err);
        return err;
      } else {
        console.log(data);
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
      deviceid: deviceId,
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

function getKey(): string {

  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const hour = now.getHours().toString().padStart(2, '0');
  const minute = now.getMinutes().toString().padStart(2, '0');
  const second = now.getSeconds().toString().padStart(2, '0');

  // paritioning the key improves performance considerably for analytics.
  // this scheme matches other vtiot apps that write to S3.
  return `${appName}/${year}/${month}/${day}/${deviceId}-${hour}${minute}${second}`;
}
