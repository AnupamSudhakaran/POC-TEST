
// @Prop({required:true})
// _id:String;

import { IsDate, IsNotEmpty, IsNumber, MAX_LENGTH, MaxLength, MinLength } from "class-validator";

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
export class AddEventDto{


    @IsNotEmpty()
    @MaxLength(50)
    eventName: String

    

    @IsNotEmpty()
    @MaxLength(500)
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

}