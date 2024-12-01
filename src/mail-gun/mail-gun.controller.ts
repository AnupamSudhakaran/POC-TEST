import { Controller, Get } from '@nestjs/common';
import { MailGunService } from './mail-gun.service';

@Controller('mail-gun')
export class MailGunController {
    constructor(private readonly mailGunService: MailGunService){}
    // @Get("v1/test")
    // async test(){
    //     await this.mailGunService.pushMail("asdf");
    // }
}
