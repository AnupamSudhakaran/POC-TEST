import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { LoginDto } from 'src/common/dto/login.dto';
import { CustProfileService } from './cust-profile.service';
import {CreateUserDto } from 'src/common/dto/create-user.dto';
import {  ResetPasswordDTO } from 'src/common/dto/reset-password.dto';
import { AuthGuard } from 'src/auth/strict.gaurd';
import { ServiceReviewDto } from 'src/common/dto/service-review.dto';
import { UpdateProfileDto } from 'src/common/dto/update-profile.dto';
import { ROLES } from 'src/model/cust-profile.model';
import { query } from 'express';
import { ForgotPasswordResetDTO } from 'src/common/dto/forgot-password-reset.dto';
import { FileInterceptor } from '@nestjs/platform-express';

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
        try{

            return this.custProfileService.createUser(createUserDto);
        }catch(err){
            throw err;
        }
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

    @Get("v1/presentrs")
    async getPresenters(@Query()params){
        const skip = params?.skip;
        const limit = params?.limit;
        const segment = params?.segment;
        const industry = params?.industry;
        if(!skip || !limit){
            return new  BadRequestException("Params not found [limit,skip]");
        }
        return await this.custProfileService.getPresentersService(skip, limit,industry, segment);
    }

    @UseGuards(AuthGuard)
    @Get("v1/users")
    async getUsers(@Query()params){
        const skip = params?.skip;
        const limit = params?.limit;
        const role = params?.role;
        if(!skip || !limit || !role){
            return new  BadRequestException("Params not found [limit,skip,role]");
        }
        if(Object.keys(ROLES).includes(role)){
            return await this.custProfileService.getUserWithRoleService(role,skip,limit);
        }
        else{
            throw new BadRequestException("Role is Wrong")
        }

    }

    @UseGuards(AuthGuard)
    @Delete("v1/profile")
    async deleteUser(@Query() params){
        const userId = httpcontext.get("userId");
        const deletionId = params?.deletionId

        if(!deletionId){
            throw new  BadRequestException("deletionId not provided");
        }
        return await this.custProfileService.deleteUser(userId,deletionId);
    }

    @Get("v1/forgot-passowrd-initiate")
    async forgotPasswordInitiate(@Query() params){
        const email =  params?.email
        if(!email){
            throw new BadRequestException("Email not provided")
        }

        return await this.custProfileService.forgotPasswordService(email);
    }   

    @Post("v1/forgot-passowrd-reset")
    async forgotPasswordReset(@Body() body: ForgotPasswordResetDTO){
        return await this.custProfileService.resetPasswordUsingRefrenceId(body);
    }

    @Post("v1/bulk-users")
    @UseInterceptors(FileInterceptor('file'))
    async addBulkProfessors(@UploadedFile() file:Express.Multer.File, @Query("role")role:ROLES){
        if(!role){
            throw new BadRequestException("Role missing")
        }
        return await this.custProfileService.bulkAddProfessors(file,role)
    }

    @Get("v1/profile")
    async getCustProfile(@Query("userId") userId){
        return await this.custProfileService.getCustomerProfileSearch(userId);
    }
}
