import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { INDUSTRY, SEGMENT } from "src/common/dto/add-event.dto";


@Schema({ collection: "events" })
export class Events {
    @Prop({ required: true })
    _id: String;

    @Prop({required: true})
    eventName: String;
    
    @Prop({ required: true })
    presenterId: String;

    @Prop({ required: true })
    description: String;

    @Prop({ required: true })
    place: String;

    @Prop({ required: true })
    fromDateTime: Date;

    @Prop({required: true})
    toDateTime: Date;
    @Prop({ required: true })
    org: String;

    @Prop({ required: false })
    attendees: Number

    @Prop({required: true})
    industry : string

    @Prop({required: true})
    segment : string
}

export type EventsDocument = Events & Document
export const EventsSchema = SchemaFactory.createForClass(Events);
