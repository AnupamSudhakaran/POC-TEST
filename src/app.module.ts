import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { CustProfileController } from './cust-profile/cust-profile.controller';
import { CustProfileModule } from './cust-profile/cust-profile.module';
import { EventsController } from './events/events.controller';
import { EventsService } from './events/events.service';
import { EventsModule } from './events/events.module';
import { DatabaseService } from './database/database.service';
import { MailGunController } from './mail-gun/mail-gun.controller';
import { MailGunModule } from './mail-gun/mail-gun.module';
import { MailGunService } from './mail-gun/mail-gun.service';
import { ScheduleModule } from '@nestjs/schedule';
import { CronTasksService } from './cron-tasks/cron-tasks.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    DatabaseModule, CustProfileModule, EventsModule, MailGunModule],
  controllers: [AppController, CustProfileController, EventsController, MailGunController],
  providers: [AppService, EventsService, DatabaseService, MailGunService, CronTasksService],
})
export class AppModule {}
