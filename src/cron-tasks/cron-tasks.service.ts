import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DatabaseService } from 'src/database/database.service';
import { MailGunService } from 'src/mail-gun/mail-gun.service';

@Injectable()
export class CronTasksService {

    constructor (private readonly databaseServive: DatabaseService,
                 private readonly mailGunService: MailGunService
    ) {}
    @Cron("0 * * * *")
    async runEmailCron(){
        const events = await this.databaseServive.getEventsForNextHour();
        for(var event of events){
                this.processForanEvent(event);
        }
        return events;
    }

    private async processForanEvent(event){
        const eventId = event?._id
        const [attendeesForAnEvent, eventData] = await Promise.all( [this.databaseServive.getAllAttendeesForAnEvent(eventId), this.databaseServive.getEventsFromDB({_id:eventId})]);
        const subject = `Reminder to attend event ${eventId}`
        const text = `Decription :: ${eventData?.description}`
        console.log("attendeesForAnEvent",attendeesForAnEvent);
        const custIds= attendeesForAnEvent.map(mapping=> mapping?.atendeeId)
        const filter = {_id:{$in:custIds}}
        const custProfiles = await this.databaseServive.getManyCustProfiles(filter)
        console.log("custProfiles", custProfiles);
        const mailArray = custProfiles.map(profile=>profile?.email);
        // const mailString = mailArray.map(String).join(',');
        // console.log("mailString",mailString);
        for(let mail of mailArray){
            this.mailGunService.pushMail(mail as string, subject, text);
        }
    }
}
