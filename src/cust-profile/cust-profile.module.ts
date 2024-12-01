import { Module } from '@nestjs/common';
import { CustProfileService } from './cust-profile.service';
import { DatabaseService } from 'src/database/database.service';

@Module({
  exports:[CustProfileService],
  providers: [CustProfileService,DatabaseService]
})
export class CustProfileModule {}
