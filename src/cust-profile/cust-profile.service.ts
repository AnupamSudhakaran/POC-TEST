import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/common/dto/create-user.dto';
import { LoginDto } from 'src/common/dto/login.dto';
import { generateJWT, hashSHA, randomId, takeCommaSepratedStringReturnList, verfiyJWT } from 'src/common/utils/utils';
import { DatabaseService } from 'src/database/database.service';
import { REST_PASSWORD_MAIL, SHA256_KEY } from 'src/common/common';
import { ResetPasswordDTO } from 'src/common/dto/reset-password.dto';
import { ServiceReviewDto } from 'src/common/dto/service-review.dto';
import { UpdateProfileDto } from 'src/common/dto/update-profile.dto';
import { ROLES } from 'src/model/cust-profile.model';
import { v4 as uuidv4 } from 'uuid';
import { MailGunService } from 'src/mail-gun/mail-gun.service';
import { ForgotPasswordResetDTO } from 'src/common/dto/forgot-password-reset.dto';
import * as xlsx from 'xlsx';
import { json } from 'express';
import { create } from 'domain';

const httpContext = require("express-http-context");

@Injectable()
export class CustProfileService {
    
    constructor(private readonly databaseService: DatabaseService,
        private readonly mailGunService: MailGunService
    ){};
    async userLoginSerice(body: LoginDto){
        try{
            const email = body?.email;
            const password = body?.password;
            const custProfile = await this.databaseService.getCustProfileUsingEmail(email);
            const passHashFromDB = custProfile?.passwordHash;
            const userId = custProfile?._id;
            if (this.verifyPassWord(password,passHashFromDB)){
                console.log(`[userLoginSerice] login success :`)
                const token = generateJWT(userId)
                const filter = {_id:userId}
                this.databaseService.updateCustProfile(filter, {lastLoggedInAt: Date.now()});
                return {
                    token,
                    custProfile
                }
            }
            else{
                console.log("[userLoginSerice] Wrong Login credentials");
                throw new BadRequestException("Wrong Credentials");
            }
        }catch(err){
            console.log(`[userLoginSerice] Some error :: ${JSON.stringify(err)}`);
            throw err;
        }
    }

    async createUser(createUserDto: CreateUserDto) {
        try {
            const addedBy = createUserDto?.addedBy || httpContext.get("userId");
            const constPassword = createUserDto?.email.split("@")[0]
            const passwordHash = hashSHA(constPassword, SHA256_KEY)
            var dbPayload = {
                _id: randomId(),
                passwordHash,
                email: createUserDto?.email,
                role: createUserDto?.role,
                org: createUserDto?.org,
                name: createUserDto?.name,
                contactNo: createUserDto?.contactNo,
                introduction: createUserDto?.introduction,
                companiesPositions: createUserDto?.companiesPositions,
                techExpertise: createUserDto?.techExpertise,
                projects: createUserDto?.projects,
                metaData: createUserDto?.metaData
            }
            if (createUserDto?.segment) {
                dbPayload["segment"] = createUserDto?.segment
            }
            if (createUserDto?.industry) {
                dbPayload["industry"] = createUserDto?.industry
            }
            if(createUserDto?.currentCourse){
                dbPayload["currentCourse"] =  createUserDto?.currentCourse
            }
            if(createUserDto?.instituteRegistrationId){
                dbPayload["instituteRegistrationId"] = createUserDto?.instituteRegistrationId   
            }
            if (addedBy) {
                dbPayload["addedBy"] = addedBy;
            }   
            await this.databaseService.createCustProfile(dbPayload);
            return {
                "status": "Success"
            }
        } catch (error) {
            throw new BadRequestException(error?.message);
        }
    }

    async resetPasswordService(resetPasswordDTO: ResetPasswordDTO){
        try{
            const userId = httpContext.get("userId");
            const custProfile = await this.databaseService.getCustProfileUsingId(userId);
            
            if (custProfile && this.verifyPassWord(resetPasswordDTO.currentPassword,custProfile?.passwordHash)){
                await this.databaseService.updateCustProfile({_id:userId},{passwordHash:hashSHA(resetPasswordDTO?.newPassword, SHA256_KEY)});
                return {
                    "status":"Success"
                }
            }
            else{
                throw new  BadRequestException("Some error occured");
            }
        }catch(err){
            console.log(`[resetPasswordService] some error while resetting the passowrd :: ${JSON.stringify(err)}`);
            throw err;
        }
    }

    async postServiceReview(userId: String,serviceReviewDto: ServiceReviewDto){
        console.log(`Have the following review ddetails :: ${JSON.stringify(serviceReviewDto)}`);
        return {
            "Success":true
        }
    }

    private verifyPassWord(password: String,passHash: String){
        const  derviedHash = hashSHA(password, SHA256_KEY);
        return derviedHash === passHash;
    }

    async updateProfileService(userId: String, updateProfileDto: UpdateProfileDto) {
        const custProfile = await this.databaseService.getCustProfileUsingId(userId);
        if (updateProfileDto.companiesPositions || updateProfileDto.introduction || updateProfileDto.projects || updateProfileDto.techExpertise ) {

            if (custProfile.role === ROLES.PROFESSOR) {
                const filter = { _id:userId };
                return await this.databaseService.updateCustProfile(filter, updateProfileDto);
            }
            else {
                throw new BadRequestException("This featre is now only for :: " + ROLES.PROFESSOR);
            }
        }
        return { "Status": "Success" };
    }

    async getPresentersService(skip, limit,industry=null,segment=null){
        try{
            const presenters = await this.databaseService.getPresentersFromDb(skip,limit,industry,segment);
            return {presenters};
        }catch(err){
            throw err;
        }
    }

    async getUserWithRoleService(role: ROLES,skip:Number,limit: Number){
        try {
            const users = await this.databaseService.getUsersFromRole(role,skip,limit);
            return users;
        } catch (error) {
            throw error;
        }
    }

    async deleteUser(userId: string, deletionId : string){
        try{
            var custProfile = await this.databaseService.getCustProfileUsingId(userId);
            if(!custProfile){
                throw new BadRequestException("Profile missing |  cannot be missing");
            }
            if(custProfile?.role === ROLES.PROFESSOR){
                this.databaseService.deleteAllEventForProfessor(userId);
                this.databaseService.deleteStudentEventMapping(userId);
            }
            
            await  this.databaseService.deleteProfile(deletionId);
            return {"status":"SUCCESS"};
            
        }catch(err){
            throw err;
        }
    }

    async forgotPasswordService(email){
        try {
            const custProfile =  await this.databaseService.getCustProfileUsingEmail(email)
            if(!custProfile){
                throw new BadRequestException("Profile not found ");
            }
            const refrenceId = `ref${uuidv4().replaceAll("-","")}`
            await this.databaseService.createForgotPasswordRefrence(refrenceId,email);
            await this.mailGunService.pushMail(email,"Password Rest Link ", REST_PASSWORD_MAIL(refrenceId))
            return {refrenceId}
        } catch (error) {
            throw error;
        }
    }

    async resetPasswordUsingRefrenceId(forgetPasswordResetDto : ForgotPasswordResetDTO) {
        try {
            const refrenceId = forgetPasswordResetDto?.refrenceId;
            const newPassword = forgetPasswordResetDto?.newPassword;
            const refrenceDetails = await this.databaseService.getForgotPasswordRefrence(refrenceId);
            if (!refrenceDetails) {
                throw new BadRequestException(`No refrence Details found for : ${refrenceId}`);
            }
            const email = refrenceDetails?.email;

            await this.databaseService.updateCustProfile({ email: email }, { passwordHash: hashSHA(newPassword, SHA256_KEY) });
            this.databaseService.deleteForgotPasswordRefrence(refrenceId, email);
            return { "status": "SUCCESS" }
        } catch (err) {
            throw err;
        }
    }


    // {
    //     Name: 'Prageet Nishant',
    //     Email: 'prageet.nishant@gmail.com',
    //     Synopsis: 'Credit risk specialist with 12+ years of experience in financial risk modeling, credit underwriting, and regulatory compliance. Strong background in financial modeling, portfolio management, and investment banking operations.\r\n' +
    //       '\r\n' +
    //       'Prageet has worked as Senior Manager - Credit Risk,  and has been associated with companies like Crisil, Srei Equipment Finance, OakNorth Analytical',
    //     Skill: 'Risk Assessment, Financial Modeling, Credit Policy',
    //     Industry: 'Finance',
    //     Segment: 'Audit/Risk & Compliance'
    //   },
    async bulkAddProfessors(file:Express.Multer.File,role){
            const workbook = xlsx.read(file.buffer, { type: 'buffer' });
            const userId  = httpContext.get("userId");
            const userProfile = await this.databaseService.getCustProfileUsingId(userId);
            if(userProfile.role ===  ROLES.STUDENT || userProfile.role === ROLES.PROFESSOR ){
                throw new BadRequestException("You are not allowed to perform this operation");
            }
            // Get the first sheet name
            const sheetName = workbook.SheetNames[0];
            // Convert sheet data to JSON
            const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
            console.log("lenght",jsonData?.length)
            for(let obj of jsonData){
                try {
                    let createUserDto:CreateUserDto =  new CreateUserDto();
                    createUserDto.role = role
                    createUserDto.name = obj["Name"].trim();
                    createUserDto.email = obj["Email"].trim();
                    createUserDto.addedBy = userId;
                    if(obj["Synopsis"]){
                        createUserDto.introduction = obj["Synopsis"];
                    }
                    if(obj["Skill"]){
                    createUserDto.techExpertise = takeCommaSepratedStringReturnList(obj["Skill"]);
                    }
                    if(obj["Industry"]){
                        createUserDto.industry = obj["Industry"].trim();
                    }
                    if(obj["Segment"]){
                        createUserDto.segment = obj["Segment"].trim();
                    }
                    if(obj["Contact No."]){
                        createUserDto.contactNo = obj["Contact No."]
                    }
                    if(obj["org"]){
                        createUserDto.org =  obj["org"]
                    }
                    if(obj["currentCourse"]){
                        createUserDto.currentCourse =  obj["currentCourse"]
                    }
                    if(obj["instituteRollNumber"]){
                        createUserDto.instituteRegistrationId =  obj["instituteRollNumber"]
                    }
                    await this.createUser(createUserDto);
                } catch (error) {
                    console.log("error");
                    console.log(error)
                }
                
            }
        
    }

    async getCustomerProfileSearch(userId) {
        try {
            const profile = await this.databaseService.getCustProfileUsingId(userId)
            if (!profile) {
                throw new BadRequestException("Profile not found for userId :: " + userId);
            }
            return profile;
        } catch (error) {
            throw new BadRequestException("Profile not found for userId :: " + userId);
        }
    }
}
