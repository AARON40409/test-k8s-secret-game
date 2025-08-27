// import { Injectable } from '@nestjs/common';
// import { TwilioService } from 'nestjs-twilio';

// @Injectable()
// export class SmsService {
//   public constructor(private readonly twilioService: TwilioService) {}

//   async sendSMS() {
//     return this.twilioService.client.messages.create({
//       body: 'SMS Body, sent to the phone!',
//       from: TWILIO_PHONE_NUMBER,
//       to: TARGET_PHONE_NUMBER,
//     });
//   }
// }