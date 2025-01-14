import { Module } from '@nestjs/common';
import { CustProfileService } from './cust-profile.service';
import { DatabaseService } from 'src/database/database.service';
import { MailGunService } from 'src/mail-gun/mail-gun.service';

@Module({
  exports:[CustProfileService],
  providers: [CustProfileService,DatabaseService, MailGunService]
})
export class CustProfileModule {}
