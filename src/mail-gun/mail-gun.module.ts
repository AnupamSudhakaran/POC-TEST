import { Module } from '@nestjs/common';
import { MailGunService } from './mail-gun.service';

@Module({
  providers: [MailGunService]
})
export class MailGunModule {}
