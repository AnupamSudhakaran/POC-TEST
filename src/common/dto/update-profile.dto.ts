

// export class CustProfile{

import { IsArray, IsOptional } from "class-validator";

export class UpdateProfileDto {

    @IsOptional()
    name: String;

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
    currentCourse:String

}