import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseROConfigService } from 'src/config/mongoose-ro-config.service';
import { MongooseRWConfigService } from 'src/config/mongoose-config-service';
import { CustProfile, CustProfileSchema } from 'src/model/cust-profile.model';
import { EventsSchema } from 'src/model/events.model';
import { RatingsSchema } from 'src/model/ratings.model';
import { AtendeeEventMappping, AtendeeEventMapppingSchema } from 'src/model/atendee-event-mapping.model';
import { ForgotPasswordSchema } from 'src/model/forgot-password.model';
@Module({
  providers: [DatabaseService,],
  exports: [],
  imports:[
    MongooseModule.forRootAsync({
      connectionName: 'studentTeacherRW',
      useClass: MongooseRWConfigService,
    }),
    MongooseModule.forFeature([
      { name: 'custProfile', schema: CustProfileSchema },
      { name: 'events', schema: EventsSchema },
      { name: 'ratings', schema: RatingsSchema },
      { name: 'attendee_event_mapping', schema: AtendeeEventMapppingSchema },
      { name: 'forgotPassword', schema: ForgotPasswordSchema },
    ], 'studentTeacherRW'),
    MongooseModule.forRootAsync({
      connectionName: 'studentTeacherRO',
      useClass: MongooseROConfigService,
    }),
    MongooseModule.forFeature([
      { name: 'custProfile', schema: CustProfileSchema },
      { name: 'events', schema: EventsSchema },
      { name: 'ratings', schema: RatingsSchema },
      { name: 'attendee_event_mapping', schema: AtendeeEventMapppingSchema },
      { name: 'forgotPassword', schema: ForgotPasswordSchema },
    ], 'studentTeacherRO'),
  ]
})
export class DatabaseModule {}
