import { IsNotEmpty } from "class-validator";

export class ForgotPasswordResetDTO {

    @IsNotEmpty()
    refrenceId: string

    @IsNotEmpty()
    newPassword: string

}   