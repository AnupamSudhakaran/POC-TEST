import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/strict.gaurd';
import { AddEventDto, SEGMENT } from 'src/common/dto/add-event.dto';
import { EventsService } from './events.service';
import { RatingDto } from 'src/common/dto/rating.dto';
import { AssosiateEventsDto } from 'src/common/dto/assosiate-events.dto';
import { pseudoRandomBytes } from 'crypto';
import { UpdateEventDto } from 'src/common/dto/update-event.dto';

const httpContext = require("express-http-context");

@Controller('/events')
export class EventsController {

    constructor(private readonly eventsService: EventsService) { }

    @UseGuards(AuthGuard)
    @Post("v1/class")
    async postEvents(@Body() body: AddEventDto) {
        const userId = httpContext.get("userId");
        return await this.eventsService.postEventsService(userId, body);
    }

    @UseGuards(AuthGuard)
    @Patch("v1/class/:eventId")
    async editEvent(@Param("eventId") eventId: String, @Body() body: UpdateEventDto) {
        const userId = httpContext.get("userId");
        return await this.eventsService.editEvent(userId, eventId, body);
    }

    @UseGuards(AuthGuard)
    @Delete("v1/class/:eventId")
    async delteEvent(@Param("eventId") eventId: String) {
        const userId = httpContext.get("userId");
        return await this.eventsService.deleteEvent(userId, eventId);
    }



    @UseGuards(AuthGuard)
    @Post("v1/rating")
    async rateEvents(@Body() body: RatingDto) {
        const userId = httpContext.get("userId");
        return await this.eventsService.postRatingService(userId, body);
    }

    // @UseGuards(AuthGuard)
    // @Post("v1/assosiate-events")
    // async  assosiateEventsController(@Body()  body: AssosiateEventsDto){
    //     const userId = httpContext.get("userId")
    //     return await this.eventsService.assosiateEventsService(userId,body);
    // }

    @UseGuards(AuthGuard)
    @Get("v1/events")
    async getEventsForUsers(@Query() params: any) {
        const userId = httpContext.get("userId");
        const skip = params?.skip;
        const limit = params?.limit;
        var segment = params?.segment
        const industry = params?.industry
        if (!skip || !limit) {
            return new BadRequestException("Params not found [limit,skip]");
        }

        return this.eventsService.getEventsService(userId, skip, limit, segment, industry);

    }

    @UseGuards(AuthGuard)
    @Get("v1/past-events")
    async getPastEvents(@Query() params: any) {
        const userId = httpContext.get("userId");
        const skip = params?.skip;
        const limit = params?.limit;

        if (!skip || !limit) {
            return new BadRequestException("Params not found [limit,skip]");
        }

        return this.eventsService.getPastEventsService(userId, skip, limit);
    }


    @UseGuards(AuthGuard)
    @Post("v1/attend/:eventId")
    async postAttendence(@Param("eventId") eventId) {
        const userId = httpContext.get("userId")
        if (!eventId) {
            throw new BadRequestException("eventId missing")
        }
        return this.eventsService.postAttendence(eventId, userId)
    }

    @UseGuards(AuthGuard)
    @Post("v1/withdraw/:eventId")
    async withDrawAttendance(@Param("eventId") eventId) {
        const userId = httpContext.get("userId");
        return this.eventsService.withdrawFromEvent(eventId, userId);
    }

    @UseGuards(AuthGuard)
    @Get("v1/to-attend")
    async eventToAttend() {
        const userId = httpContext.get("userId");
        return await this.eventsService.getEventsToAttend(userId);
    }

    @Get("v1/test")
    async test() {
        return await this.eventsService.test();
    }
}
