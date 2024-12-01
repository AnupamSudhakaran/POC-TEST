import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { DatabaseService } from 'src/database/database.service';

@Module({
    exports:[EventsService],
    providers: [EventsService,DatabaseService]
  
})
export class EventsModule {}
