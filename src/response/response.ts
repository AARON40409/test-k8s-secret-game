export default class HttpResponse {
    static async send(promise: Promise<any>, message) {
      return new Promise(async (resolve, reject) => {
        await promise
          .then((data) => {
            const response: any = {
              error: false,
              message,
              data: data,
            };
            resolve(response);
          })
          .catch((error: any) => {
            console.log('Error rejection : ', error);
            reject(error);
          });
      });
    }
  }
  