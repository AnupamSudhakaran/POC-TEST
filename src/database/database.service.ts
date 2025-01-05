import { Inject, Injectable } from '@nestjs/common';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';``
import { privateDecrypt } from 'crypto';
import { threadId } from 'worker_threads';
import { fileURLToPath } from 'url';
import { ROLES } from 'src/model/cust-profile.model';

@Injectable()
export class DatabaseService {
    constructor(
        @InjectConnection("studentTeacherRW")
        private rwConnection: Connection,
        @InjectConnection("studentTeacherRO")
        private roConnection: Connection,
    ) { };

    async getCustProfileUsingEmail(email: String){
        try{
            console.log(`[getCustProfileUsingEmail] trying to fetch customer Profile using email :: ${email}`)
            const model = this.roConnection.model("custProfile")
            const custProfile = await model.findOne({email})
            return custProfile ;
        }catch(err){
            console.log(`[getCustProfileUsingEmail] Got an erro while trynig to get email :: ${JSON.stringify(err)}`)
            throw err;
        }
    }

    async getCustProfileUsingId(userId: String){
        try{
            console.log(`[getCustProfileUsingId] getting custprofile using :: ${userId}`)
            const model =this.roConnection.model("custProfile");
            const custProfile = await model.findOne({_id:userId})
            return custProfile;

        }catch(err){
            console.log(`[getCustProfileUsingId] error :: ${JSON.stringify(err)} `)
            throw err;
        }
    }
    
    async updateCustProfile(filter:any, updateBody: any){
        try{
            const model =this.rwConnection.model("custProfile"); 
            const custProfile = await model.updateOne(filter, {$set:updateBody});
            return custProfile;
        }catch(err){
            console.log(`[updateCustProfile] got some error :: ${JSON.stringify(err)}`);
            throw err;

        }
    }

    async getManyCustProfiles (filter){
        try{
            const model =this.roConnection.model("custProfile"); 
            console.log("filter",filter);
            const custProfile = await model.find(filter);
            return custProfile;
        }catch(err){
            throw err;
        }

    }

    async createCustProfile(dbPayload: any){
        try{
            console.log(`[createCustProfile] trying to create customer Profile using payload :: ${JSON.stringify(dbPayload)}`)
            const model = this.rwConnection.model("custProfile")
            const custProfile = await model.create(dbPayload)
            return custProfile ;
        }catch(err){
            console.log(`[createCustProfile] Got an error while trynig crate  :: ${JSON.stringify(err)}`)
            throw err;
        }
    }

    async postRatingToDB(dbPayload: any){
        try{
            console.log(`[postRatingToDB] :: ${JSON.stringify(dbPayload)}`)
            const model = this.roConnection.model("ratings");
            const ratings = await model.create(dbPayload);
            return ratings;

        }catch(err){
            console.log(`[postRatingToDB] Failed to post  :: ${err}`);
            throw err;

        }
    }

    async getRating(filter){
        const model = this.roConnection.model("ratings");
        return await model.findOne(filter)
    }
    
    async writeEventToDB(data){
        try{
            console.log(`Trying to write with data :: ${JSON.stringify(data)}`);
            const model = this.rwConnection.model("events");
            return await model.create(data);
        }catch(err){
            console.log(`Cannot write because :: ${JSON.stringify(err)}`);
            throw err;
        }
    }

    async getEventsFromDB(filter){
        try{
            console.log(`Trying to get events using filter :: ${JSON.stringify(filter)}`)
            const model = this.roConnection.model("events");
            return model.findOne(filter);

        }catch(err){
            console.log(`Got this error while trying to get event ::${JSON.stringify(err)}`)
            throw err;
        }
    }

    async insertEventAttendeeMapping(data){
        try{
            console.log(`Inserting data into data :: ${JSON.stringify(data)}`);
            const model = this.roConnection.model("attendee_event_mapping");
            return await model.create(data);
        }catch(err){
            console.log(`Got an error while trying to inserting event :: ${JSON.stringify(err)}`);
            throw err;
        }
    }

    async getEventsForProffessor(userId,skip,limit){
        try{    
            const model = this.roConnection.model("events");
            const currTime = Date.now();
            const events = model.find({presenterId:userId,fromDateTime:{$gte:currTime}})
            .sort({fromDateTime:-1})
            .skip(skip)
            .limit(limit);            
            return events;
        }catch(err){
            throw err
        }
    }

    async getStudentEventMappings(userId,skip,limit){
        try{
            const model = this.roConnection.model("attendee_event_mapping");
            const eventMapping = await model.find({atendeeId:userId})
            .sort({eventStartTime:-1})
            .skip(skip)
            .limit(limit);
            return eventMapping

        }catch(err){
            throw err;
        }
    }

    async getMultipleEvents(eventIds: String[],skip,limit){
        try{
            const model = this.roConnection.model("events");
            const events = await model.find({ _id:{$in:eventIds},fromDateTime:{$gte:Date.now()} })
                .sort({fromDateTime: -1})
                .skip(skip)
                .limit(limit)
            return events;
        }catch(err){
            throw err;
        }
    }
    async getPastEventsForProfessorFromDB(userId,skip,limit){
        try{
            const model = this.roConnection.model("events");
            const currTime = Date.now();
            const events = await model.find({presenterId:userId,fromDateTime:{$lte:currTime}})
                            .sort({fromDateTime: 1})
                            .skip(skip)
                            .limit(limit)
            
            return events;
        }catch(err){
            throw err;
        }
    }

    async getEventsForStudents(org,skip,limit){
        try{
            const model = this.roConnection.model("events");
            const currTime  = Date.now()
            const events = await model.find({org:org,fromDateTime:{$lte:currTime}})
            .sort({fromDateTime:1})
            .skip(skip)
            .limit(limit)
            return events;
        }catch(err){
            throw err;
        }
    }

    async getPresentersFromDb(skip, limit) {
        try {
            const model  = this.roConnection.model("custProfile");
            const  presneters = await model.find({role: ROLES.PROFESSOR})
            .sort({lastLoggedInAt:-1})
            .skip(skip)
            .limit(limit);
            return presneters
        } catch (err) {
            throw err
        }
    }

    async createEventattendeeMapping(eventId,userId,expiry){
        try{
            const model = this.rwConnection.model("attendee_event_mapping");
            const result  = await model.updateOne({eventId,userId}, {$set:{eventId,userId,expiry},upsert:true});
        }catch(err){
            throw err;
        }
    }

    async deleteEventAttendeeMapping(eventId,userId){
        try{
            const model = this.rwConnection.model("attendee_event_mapping");
            const result = await model.deleteOne({eventId,userId});
        }catch(err){
            throw err;
        }
    }

    async getEventattendeeMapping(eventId,userId){
        try{
            const model = this.rwConnection.model("attendee_event_mapping");
            const result  = await model.findOne({eventId,userId});
            return result;
        }catch(err){
            throw err;
        }
    }

    async addAttendeeToEvent(eventId,addby = 1 ){
        try{
            const model = this.rwConnection.model("events");
            await model.updateOne({_id:eventId},{$inc:{attend:addby}});
        }catch(err){
            throw err;
        }
    }

    async substracrtAttendeeToEvent(eventId,substractBy= -1){
        try{
            const model = this.rwConnection.model("events");
            await model.updateOne({_id:eventId},{$inc:{attend:substractBy}});
        }catch(err){
            throw err;
        }
    }

    async getEventsForNextHour(){
        try{
            const model = this.rwConnection.model("events");
            const filter = {fromDateTime:{$gte:Date.now() - 1 * 60 * 60 * 1000, $lt: Date.now() + 10 * 60 * 60 * 1000}}
            console.log("df",filter);
            const events = await model.find(filter);
            return events;
        }catch(err){
            throw err;
        }
    }

    async getAllAttendeesForAnEvent(eventId){
        try{
            const model = this.rwConnection.model("attendee_event_mapping");
            const attendees = await model.find({eventId});
            return attendees;
        }catch(err){
            throw err;
        }
    }

    async getUsersFromRole(role: ROLES,skip,limit){
        try {
            const model  = this.roConnection.model("custProfile");
            const  users = await model.find({role})
            .sort({lastLoggedInAt:-1})
            .skip(skip)
            .limit(limit);
            return users;
        } catch (error) {
            throw error;
        }
    }

    
}
