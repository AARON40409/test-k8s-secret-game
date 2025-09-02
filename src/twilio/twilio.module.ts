import { Module } from "@nestjs/common";
import { OtpController } from "./twilio.controller";
import { OtpService } from "./twilio.service";


@Module({
  controllers: [OtpController],
  providers: [OtpService]
})
export class OtpModule {}
