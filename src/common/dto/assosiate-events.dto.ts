import { IsNotEmpty } from "class-validator";

export class AssosiateEventsDto {

    @IsNotEmpty()
    eventId: String

    @IsNotEmpty()
    attendeeId: String

}   