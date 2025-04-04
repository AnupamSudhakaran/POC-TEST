
// @Prop({required:true})
// _id:String;

import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsString, MAX_LENGTH, MaxLength, MinLength } from "class-validator";

// @Prop({required: true})
// presenterId:String;

// @Prop({required:true})
// description:String;

// @Prop({required:true})
// place:String;

// @Prop({required:true})
// dateTime:Date;

// @Prop({required:false})
// attendees:Number;

export enum INDUSTRY  {
    TECHNICAL= "TECHNICAL",
    MECHANICAL = "MECHANICAL",
    MOTIVATIONAL = "MOTIVATIONAL"
}

export enum SEGMENT{
    SEGMENT1 = "SEGMENT1",
    SEGMENT2 = "SEGMENT2",
    SEGMENT3 = "SEGMENT3"
    
}

export class AddEventDto{


    @IsNotEmpty()
    @MaxLength(50)
    eventName: String

    
    @IsNotEmpty()
    @MaxLength(1500)
    @MinLength(20)
    description:String

    @IsNotEmpty()
    place:String

    @IsNumber()
    @IsNotEmpty()
    fromDateTime:Date;

    @IsNumber()
    @IsNotEmpty()
    toDateTime:Date;

    @IsNotEmpty()
    industry: string

    @IsNotEmpty()
    segment:string
}