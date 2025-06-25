import { IsArray, IsEmail, IsEnum, IsNotEmpty, IsOptional } from "class-validator";
import { ROLES } from "src/model/cust-profile.model";

export class CreateUserDto{

    @IsNotEmpty()
    @IsEmail()
    email:String;

    @IsNotEmpty()
    name:String;
    
    @IsNotEmpty()
    @IsEnum(ROLES)
    role:ROLES

    @IsOptional()
    org:String  

    @IsOptional()
    contactNo: String;

    @IsOptional()
    introduction: String;

    @IsOptional()
    industry: String;

    @IsOptional()
    segment: String;

    @IsArray()
    @IsOptional()
    companiesPositions: String[]

    @IsArray()
    @IsOptional()
    techExpertise: String[]

    @IsArray()
    @IsOptional()
    projects: String[]

    @IsOptional()
    currentCourse:String

    @IsOptional()
    metaData: any

    @IsOptional()
    addedBy: String;    

    @IsOptional()
    instituteRegistrationId: String


}