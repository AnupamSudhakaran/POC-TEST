import { IsEmail, IsEnum, IsNotEmpty } from "class-validator";
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
}