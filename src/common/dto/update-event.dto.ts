
// @Prop({required:true})
// _id:String;

import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MAX_LENGTH, MaxLength, MinLength } from "class-validator";

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

export class UpdateEventDto{


    @IsOptional()
    @MaxLength(50)
    eventName: String

    @IsOptional()
    @MaxLength(500)
    @MinLength(20)
    description:String

    @IsOptional()
    place:String

    @IsNumber()
    @IsOptional()
    fromDateTime:Date;

    @IsNumber()
    @IsOptional()
    toDateTime:Date;

    @IsOptional()
    @IsEnum(INDUSTRY)
    industry: INDUSTRY

    @IsOptional()
    @IsEnum(SEGMENT)
    segment: SEGMENT
}