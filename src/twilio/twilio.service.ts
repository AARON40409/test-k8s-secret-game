import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Twilio } from 'twilio';

@Injectable()
export class OtpService {
  private client: Twilio;

  constructor() {
    this.client = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  }

  async sendOtp(phone: string) {
    return this.client.verify.v2.services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verifications
      .create({ to: phone, channel: 'sms' });
  }

  async verifyOtp(phone: string, code: string) {
    try {
      return await this.client.verify.v2.services(process.env.TWILIO_VERIFY_SERVICE_SID)
        .verificationChecks
        .create({ to: phone, code });
    } catch (error) {
      if (error.status === 400) {
        throw new BadRequestException('Code OTP invalide ou expiré');
      }
      throw new InternalServerErrorException('Erreur lors de la vérification OTP');
    }
  }
}
