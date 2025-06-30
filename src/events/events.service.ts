import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { contains } from 'class-validator';
import { emit } from 'process';
import { AddEventDto } from 'src/common/dto/add-event.dto';
import { AssosiateEventsDto } from 'src/common/dto/assosiate-events.dto';
import { RatingDto } from 'src/common/dto/rating.dto';
import { UpdateEventDto } from 'src/common/dto/update-event.dto';
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
                eventName: addEventDto.eventName,
                org:custProfile?.org,
                attendees: 0  ,
                industry : addEventDto.industry,
                segment: addEventDto.segment            
            }
            return await this.databaseService.writeEventToDB(dbPayload);
        }catch(err){
            console.log(`[postEventsService] Got an error while trying to postEvents`)
            throw err;
        }
        
    }

    
    async editEvent(userId:String, eventId:String,updateEventDto: UpdateEventDto){
        try {
            let [custProfile,event]  = await Promise.all([this.databaseService.getCustProfileUsingId(userId), this.databaseService.getEventFromEventID(eventId)])
            if(custProfile?.role === ROLES.PROFESSOR && event?.presenterId ===  userId){
                let dbPayload:any = {}
                if(updateEventDto?.description){
                    dbPayload.description = updateEventDto?.description
                }

                if(updateEventDto?.eventName){
                    dbPayload.eventName = updateEventDto?.eventName
                }
                
                if(updateEventDto?.fromDateTime){
                    dbPayload.fromDateTime = updateEventDto?.fromDateTime
                }
                
                if(updateEventDto?.industry){
                    dbPayload.industry = updateEventDto?.industry
                }

                if(updateEventDto?.place){
                    dbPayload.place = updateEventDto?.place
                }

                
                if(updateEventDto?.segment){
                    dbPayload.segment = updateEventDto?.segment
                }

                
                if(updateEventDto?.toDateTime){
                    dbPayload.toDateTime = updateEventDto?.toDateTime
                }
                return this.databaseService.updateEvent(eventId,dbPayload)
            }
            throw new BadRequestException("You are not authorized to do this action")
            
        } catch (error) {
            throw error;
        }
    }

    async deleteEvent(userId:String , eventId:String){
        try {
            let [custProfile,event]  = await Promise.all([this.databaseService.getCustProfileUsingId(userId), this.databaseService.getEventFromEventID(eventId)])
            if(custProfile?.role === ROLES.PROFESSOR && event?.presenterId ===  userId){
                return await this.databaseService.deleteEvent(eventId)
            }
            
            throw new BadRequestException("You are not allowed to do this action")
        } catch (error) {
            
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

    async getEventsService(userId,skip,limit, segment = null, industry =  null){
        try{
                const events =  await this.getEventsForAttendees("RANDOM_ORG",skip,limit,segment,industry);
                return {events};
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
            const isEventAlreadyyMapped = await this.databaseService.getEventattendeeMapping(eventId,userId);
            if(isEventAlreadyyMapped){
                throw new BadRequestException("event already being attendeed");
            }
            const [event, addattendee] = await Promise.all([this.databaseService.getEventsFromDB(filter), 
                this.databaseService.addAttendeeToEvent(eventId)]); 
            if(!event){
                throw new BadRequestException("Event not valid")
            }
            const eventMapping = await this.databaseService.createEventattendeeMapping(eventId, userId, event?.toDateTime, event?.presenterId);
        }catch(err){
            throw err;
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

    async getEventsToAttend(userId: string){
        try {
            const events = await this.databaseService.getEventsForAttendee(userId);
            const eventArray = events.map((eve)=>{
                return eve?.eventId;
            });
            const eventDetails = await this.databaseService.getEventDataFromEventsArray(eventArray);
            return eventDetails;
        } catch (error) {
            throw error;
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

    private async getEventsForAttendees(org:String, skip:Number, limit: Number, segment = null, industry = null){
        try{
            // const eventMapps = await this.databaseService.getStudentEventMappings(userId,skip,limit);
            // console.log(eventMapps);
            // const eventIds = eventMapps.map((event)=>{
            //     return event?.eventId;
            // })
            // console.log("df",eventIds);
            return await this.databaseService.getEventsForStudents(org,skip,limit,segment, industry);
            // const events
        }catch(error){
            throw error;
        }
    }

    async getAttendeesForAnEvent(eventId: String) {
        try {
            if (!eventId) {
                throw new BadRequestException("eventId missing")
            }
            const attendees = await this.databaseService.getAllAttendeesForAnEvent(eventId);
            const attendeeIds = attendees.map((attendee) => attendee?.atendeeId);
            const custProfiles = await this.databaseService.getManyCustProfiles({_id:{$in:attendeeIds}});
            const abstractedCustProfiles = custProfiles.map((custProfile) => this.returnAbstractCustProfile(custProfile));
            return abstractedCustProfiles;
        } catch (error) {
            throw error;
        }
    }

    private returnAbstractCustProfile(custProfile) {
        return {
            id : custProfile?._id,
            name :custProfile?.name,
            email: custProfile?.email,
            role: custProfile?.role,    
            cocontactNo: custProfile?.contactNo,
        }
    }
}
