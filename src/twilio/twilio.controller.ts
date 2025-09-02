import { Controller, Post, Body } from '@nestjs/common';
import { OtpService } from './twilio.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Controller('v1/otp')
@ApiTags('APIs backoffice')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}
  @Post('send')
    @ApiResponse({
      status: 200,
      description: "Envoyer OTP",
    })
    @ApiOperation({ summary: 'Envoyer OTP' })
  async sendOtp(@Body() sendOtpDto: SendOtpDto) {
    return this.otpService.sendOtp(sendOtpDto.phone);
  }

  @Post('verify')
  @ApiResponse({
    status: 200,
    description: "Vérifier OTP",
  })
    @ApiOperation({ summary: 'Vérifier OTP' })
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.otpService.verifyOtp(verifyOtpDto.phone, verifyOtpDto.code);
  }
}
