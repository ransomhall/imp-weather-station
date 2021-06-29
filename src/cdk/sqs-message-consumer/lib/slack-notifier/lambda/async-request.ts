import https = require('https')

export interface HttpsResponse {
  statusCode: number;
  statusMessage: string;
  responseBody: string;
}

export async function asyncHttpsRequest(options:https.RequestOptions, data = ''): Promise<HttpsResponse> {

    return new Promise((resolve, reject) => {
             
      const req = https.request(options, (res) => {
        let responseBody:string = '';
  
        res.on('data', (chunk:string) => {
          responseBody += chunk;
        });
  
        res.on('end', () => {
          var response: HttpsResponse = {
            statusCode: res.statusCode || 500,
            statusMessage: res.statusMessage || 'Something went wrong, status message was not returned.',
            responseBody: responseBody
          };

          resolve(response);

        });
      });
  
      req.on('error', (err) => {
        reject(err);
      });
  
      console.log(data);
      req.write(data);
      req.end();
    });

  }