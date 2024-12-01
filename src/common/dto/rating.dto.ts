import { IsNotEmpty, IsNumber, IsOptional, MaxLength } from "class-validator";
import { NumberExpression } from "mongoose";

export class RatingDto{

    @IsNotEmpty()
    eventId: String;

    @IsNotEmpty()
    @IsNumber()
    rating:Number;

    @IsOptional()
    @MaxLength(250)
    review:String


}