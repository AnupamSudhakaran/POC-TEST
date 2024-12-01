import { BadRequestException, Body, Controller, Get, Post, Put, Query, UseGuards } from '@nestjs/common';
import { LoginDto } from 'src/common/dto/login.dto';
import { CustProfileService } from './cust-profile.service';
import {CreateUserDto } from 'src/common/dto/create-user.dto';
import {  ResetPasswordDTO } from 'src/common/dto/reset-password.dto';
import { AuthGuard } from 'src/auth/strict.gaurd';
import { ServiceReviewDto } from 'src/common/dto/service-review.dto';
import { UpdateProfileDto } from 'src/common/dto/update-profile.dto';

const httpcontext = require("express-http-context");

@Controller('/profile')
export class CustProfileController {

    constructor(private readonly custProfileService: CustProfileService){};
    @Post("/v1/login")
    async userLogin(@Body() loginBody: LoginDto){
        return this.custProfileService.userLoginSerice(loginBody);
    }

    @Post("v1/user")
    async createUser(@Body() createUserDto: CreateUserDto){
        return this.custProfileService.createUser(createUserDto);
    }
     
    @UseGuards(AuthGuard)
    @Put("v1/rest-password")
    async resetPassword(@Body() resetPasswordDto:ResetPasswordDTO  ){
        return this.custProfileService.resetPasswordService(resetPasswordDto);
    }

    @UseGuards(AuthGuard)
    @Get("v1/tes")
    async test(){
        const userId = httpcontext.get("userId")
        return userId;
    }

    @UseGuards(AuthGuard)
    @Get("v1/post-review")
    async postReview(@Body() serviceReviewDto: ServiceReviewDto){
        const userId = httpcontext.get("userId")
        return this.custProfileService.postServiceReview(userId, serviceReviewDto)

    }

    @UseGuards(AuthGuard)
    @Put("v1/update-profile")
    async updateProfile(@Body() updatProfileReq: UpdateProfileDto) {
        const userId = httpcontext.get("userId");
        return this.custProfileService.updateProfileService(userId,updatProfileReq );
    }

    @UseGuards(AuthGuard)
    @Get("v1/presentrs")
    async getPresenters(@Query()params){
        const skip = params?.skip;
        const limit = params?.limit;

        if(!skip || !limit){
            return new  BadRequestException("Params not found [limit,skip]");
        }
        return await this.custProfileService.getPresentersService(skip, limit);
    }

}
