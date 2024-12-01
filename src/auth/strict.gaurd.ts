import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
import { verfiyJWT } from 'src/common/utils/utils';
const httpcontext = require('express-http-context');

@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): any{

        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }

    private  validateRequest(request) {
        try{
            const headers = request.headers;
            const bearerToken = request?.headers?.authorization;
            if(!bearerToken){
                throw new BadRequestException("Token Invalid");
            }
            const token = verfiyJWT(bearerToken.split(" ")[1]);

            if(!token?.sub){
                throw new BadRequestException("Token Invalid");
            }
            httpcontext.set("userId",token?.sub);
            return true;
        }catch(err){
            console.log("timeout");
            throw err;
        }
    }
}

