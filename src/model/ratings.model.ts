import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


@Schema({ collection: "ratings" })
export class Ratings {

    @Prop({required: true})
    eventId: String;

    @Prop({required: true})
    ratedBy:String;

    @Prop({required: true})
    rating: Number

    @Prop({required: false})
    review: String
}


export type RatingsDocument =  Ratings & Document
export const RatingsSchema = SchemaFactory.createForClass(Ratings);
