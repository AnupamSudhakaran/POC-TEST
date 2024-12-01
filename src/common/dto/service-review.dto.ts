import { IsEmail, IsNotEmpty, IsOptional, MaxLength, MinLength } from "class-validator";

export class ServiceReviewDto {

    @IsNotEmpty()
    userId:String;

    @IsNotEmpty()
    @IsEmail()
    email:String;

    @IsNotEmpty()
    name:String;

    @IsOptional()
    phoneNumber:String;

    @IsNotEmpty()
    @MinLength(10)
    @MaxLength(500)
    review: String;

}