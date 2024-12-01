import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Date } from "mongoose";

@Schema({ collection: "attendee_event_mapping"})
export class AtendeeEventMappping {

    @Prop({ required: true, indexe: true })
    atendeeId: String

    @Prop({ required: true , index: true})
    eventId: String

    @Prop({ required: false, type: Date, expires: 100 })
    expiry: Date

}

export type AtendeeEventMapppingDocument =  AtendeeEventMappping & Document
export const AtendeeEventMapppingSchema = SchemaFactory.createForClass(AtendeeEventMappping);
