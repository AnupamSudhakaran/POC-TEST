import { Injectable } from '@nestjs/common';
var nodemailer = require('nodemailer');

@Injectable()
export class MailGunService {


    async pushMail (toMail : String , subject, text){
        var transporter = nodemailer.createTransport({
            name:"smtp.mail.com",
            host: 'osttalent.com',
            port: 465,
            secure: true, // true for 465, false for other ports        
            auth: {
              user: 'timetappers@osttalent.com',
              pass: '@Fz2tFS3~Q?J'
            }
          });
          
          var mailOptions = {
            from: 'timetappers@osttalent.com',
            to: toMail,
            subject: subject,
            text: text
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
          

    }


}
