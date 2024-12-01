import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { AddEventDto } from 'src/common/dto/add-event.dto';
import { AssosiateEventsDto } from 'src/common/dto/assosiate-events.dto';
import { RatingDto } from 'src/common/dto/rating.dto';
import { randomEventId } from 'src/common/utils/utils';
import { DatabaseService } from 'src/database/database.service';
import { CustProfile, ROLES } from 'src/model/cust-profile.model';


@Injectable()
export class EventsService {

    constructor(private readonly databaseService: DatabaseService){}
    async postEventsService(userId:String,addEventDto: AddEventDto){
        try{
            console.log("[postEventsService] trying to post events");
            const custProfile = await this.databaseService.getCustProfileUsingId(userId);
            if(!(custProfile?.role === ROLES.PROFESSOR)){
                throw new BadRequestException("You are not allowed to Do this ");
            }
            
            const dbPayload = {
                _id: randomEventId(),
                description: addEventDto?.description,
                presenterId: userId,
                fromDateTime: addEventDto.fromDateTime,
                toDateTime: addEventDto?.toDateTime,
                place:addEventDto.place,
                org:custProfile?.org,
                attendees: 0              
            }
            return await this.databaseService.writeEventToDB(dbPayload);
        }catch(err){
            console.log(`[postEventsService] Got an error while trying to postEvents`)
            throw err;
        }
        
    }

    async postRatingService(userId,ratingDto: RatingDto){
        try{    
            const payload = {
                eventId:ratingDto?.eventId,
                rating:ratingDto?.rating,
                ratedBy: userId
            };
            if(ratingDto?.review){
                payload["review"] = ratingDto?.review;
            }
            return await this.databaseService.postRatingToDB(payload);
        }catch(err){
            console.log(`[postRatingService] Got this error while posting rating :: ${JSON.stringify(err)}`);
            throw err;
        }
    }

    async assosiateEventsService(userId, assosiateEventsDto: AssosiateEventsDto) {
        try{
            const eventFilter = {_id:assosiateEventsDto?.eventId};
            const [custProfile, eventDetails] = await Promise.all([this.databaseService.getCustProfileUsingId(userId), this.databaseService.getEventsFromDB(eventFilter)]);
            
            if (custProfile?.role != ROLES.SUBADMIN) {
                throw new ForbiddenException("You are not allowed to do this Action");
            }
            await this.createEventMapping(eventDetails, assosiateEventsDto, custProfile);
            return {
                "status": "SUCCESS"
            }
        }catch(err){
            throw err;
        }
    }

    async getEventsService(userId,skip,limit){
        try{
            const custProfile =await this.databaseService.getCustProfileUsingId(userId);
            if(custProfile?.role === ROLES.PROFESSOR){
                const events =  await  this.getEventsForProffesor(userId,skip,limit);
                return {events};
            }
            else{
                const events =  this.getEventsForAttendees(userId,skip,limit);
                return {events};
            }
        }catch(err){
            throw err;
        }
    }
    async getPastEventsService(userId: String, skip: Number, limit: Number){
        const custProfile = await this.databaseService.getCustProfileUsingId(userId);
        if(!(custProfile?.role === ROLES.PROFESSOR)){
            throw new BadRequestException("You are not allowed, At the moment to access this feature");
        }
        return await this.databaseService.getPastEventsForProfessorFromDB(userId,skip,limit);
    }

    async test(){
        // return await this.databaseService.getMultipleEvents(["EV23861500d7","EV23861500d8"]);
    }

    async getEventsForProffesor(userId, skip, limit) {
        try {
            return await this.databaseService.getEventsForProffessor(userId,skip,limit)
        } catch (err) {
            throw err;
        }
    }

    async postAttendence(eventId: String, userId: String){
        try{
            const filter = {_id:eventId}
            const [event, addattendee] = await Promise.all([this.databaseService.getEventsFromDB(filter), 
                this.databaseService.addAttendeeToEvent(eventId)]); 

            const eventMapping = await this.databaseService.createEventattendeeMapping(eventId, userId, event?.expiry);
        }catch(err){
            throw new err;
        }
    }

    async withdrawFromEvent(eventId: String, userId: String){
        try{
            const filter = {_id:eventId} ;
            const [event, addattendee] = await Promise.all([this.databaseService.getEventsFromDB(filter), 
                this.databaseService.substracrtAttendeeToEvent(eventId)]); 
            const eventMapping = await this.databaseService.deleteEventAttendeeMapping(eventId, userId);

            
        }catch(err){
            throw err;
        }
    }

    private async createEventMapping(eventDetails,assosiateEventsDto: AssosiateEventsDto,custProfile){
        try{
            const eventDbPayload = {
                atendeeId:assosiateEventsDto?.attendeeId,
                eventId:assosiateEventsDto?.eventId,
                eventStartTime:eventDetails?.fromDateTime,
                eventExpiry:eventDetails?.toDateTime,
                org:custProfile?.org
            }
            return await this.databaseService.insertEventAttendeeMapping(eventDbPayload);
        }catch(err){
            throw err;
        }

    }

    private async getEventsForAttendees(userId:Number, skip:Number, limit: Number){
        try{
            const eventMapps =await this.databaseService.getStudentEventMappings(userId,skip,limit);
            console.log(eventMapps);
            const eventIds = eventMapps.map((event)=>{
                return event?.eventId;
            })
            console.log("df",eventIds);
            return await this.databaseService.getEventsForStudents(skip,limit);
            // const events
        }catch(error){
            throw error;
        }
    }
}
