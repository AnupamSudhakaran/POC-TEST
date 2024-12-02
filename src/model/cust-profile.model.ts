import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export enum ROLES {
    STUDENT="STUDENT",
    PROFESSOR="PROFESSOR",
    ADMIN="ADMIN",
    SUBADMIN="SUBADMIN"
}

@Schema({ collection: "cust_profile"})
export class CustProfile{

    @Prop({required:true})
    _id: String;

    @Prop({required: true})
    passwordHash: String
    
    @Prop({required: true, index:true, unique:true})
    email: String

    @Prop({required: true, enum: ROLES})
    role: ROLES

    @Prop({required: true })
    org:String
    
    @Prop({required: false})
    name: String;

    @Prop({required: false})
    industry: String;

    @Prop({required: false})
    segment: String

    @Prop({required:false})
    contactNo:String

    @Prop({required:false})
    introduction: String;

    @Prop({required:false})
    companiesPositions: any[]

    @Prop({required:false})
    techExpertise: String[]

    @Prop({required:false})
    projects: String[]

    @Prop({required: false})
    lastLoggedInAt: Date;l
}

export type CustProfileDocument =  CustProfile & Document
export const CustProfileSchema = SchemaFactory.createForClass(CustProfile);


