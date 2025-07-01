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

    @Cron('0 10 * * *')
    async runEmailCron5Days(){
        const events = await this.databaseServive.getEventsForNextFiveDays();
        for(var event of events){
                this.processForanEvent(event);
        }
        return events;
    }

    @Cron('0 10 * * *')
    async runEmailCron2Days(){
        const events = await this.databaseServive.getEventsForNextTwoDays();
        for(var event of events){
                this.processForanEvent(event);
        }
        return events;
    }

    private async processForanEvent(event){
        const eventId = event?._id
        const [attendeesForAnEvent, eventData] = await Promise.all( [this.databaseServive.getAllAttendeesForAnEvent(eventId), this.databaseServive.getEventsFromDB({_id:eventId})]);
        const presenter = await this.databaseServive.getCustProfileUsingId(event?.presenterId);
        const subject = `TimeTappers.Com | Event Notification |Reminder to attend event ${eventData?.eventName}`;
        const text = `Decription :: ${eventData?.description}\n
                Name :: ${eventData?.eventName}\n
                starts At:: ${eventData?.fromDateTime}\n
                Location :: ${eventData?.place}\n
                Presented By :: ${presenter?.firstName} ${presenter?.lastName}\n
                Presenter Description :: ${presenter?.description}\n
        `
        const custIds= attendeesForAnEvent.map(mapping=> mapping?.atendeeId)
        const filter = {_id:{$in:custIds}}
        const custProfiles = await this.databaseServive.getManyCustProfiles(filter)
        const mailArray = custProfiles.map(profile=>profile?.email);
        // const mailString = mailArray.map(String).join(',');
        // console.log("mailString",mailString);
        this.mailGunService.pushMail(presenter?.email,subject,text);
        for(let mail of mailArray){
            this.mailGunService.pushMail(mail as string, subject, text);
        }
    }
}
