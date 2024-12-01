import { IsNotEmpty } from "class-validator";

export class ResetPasswordDTO  {

    @IsNotEmpty()
    currentPassword: String;

    @IsNotEmpty()
    newPassword: String;

}