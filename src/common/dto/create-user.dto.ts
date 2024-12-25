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

    @IsNotEmpty()
    org:String  

    @IsOptional()
    contactNo: String;

    @IsOptional()
    introduction: String;

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
    metaData: any
}