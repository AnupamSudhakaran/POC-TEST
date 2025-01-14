import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


@Schema({ collection: "forgotPassword" })
export class ForgotPassword {
    @Prop({ required: true })
    _id: String;

    @Prop({required: true})
    email : string

    @Prop({required: false, expires: 10 * 60 * 60})
    initiatedBy: Date

}

export type ForgotPasswordDocument = ForgotPassword & Document
export const ForgotPasswordSchema = SchemaFactory.createForClass(ForgotPassword);
