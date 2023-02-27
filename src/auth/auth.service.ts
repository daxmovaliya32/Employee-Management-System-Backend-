import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { encryptpassword, verifypassword } from '../helper/password.helper';
import { Model } from 'mongoose';
import { Member, MemberDocument } from 'src/models/Member.interface';
import { JwtService } from '@nestjs/jwt';
import { CloudinaryService } from 'src/helper/cloudinary/cloudinary.service';
const otpGenerator = require('otp-generator')
import * as dotenv from 'dotenv';
import { sendMail } from './sendmail';
import { verifydto } from 'src/members/member.dto';
import { emailforsendotp, forgotpassword, verifingotp } from './auth.dto';

dotenv.config(); 

@Injectable()
export class AuthService {
    constructor(
        @InjectModel('Member') private readonly MemberModel:Model<MemberDocument>,
        private readonly jwtService:JwtService,
        private readonly cloudinary: CloudinaryService
    ){}

    //for login Member
    async signinMember(email:string,password:string)
    {
        try{      
            const check = await this.MemberModel.findOne({email:email});
            if(!check)
            {
                return {message:"email not exist in database"}
            }

            const ispassword = await verifypassword(password,check.password);
            
            if(!ispassword)
            {
                return {message:"password is not correct"}
            }

            const token = this.jwtService.sign(JSON.stringify(check))
            return {Member:check.email,access_token:token};
        
        } catch (error) {
            console.log(error);
            
        }
   }

   //for register Member
   async signupMember(Member:Member)
   {  
       const emailexist =await this.MemberModel.findOne({email:Member.email,isemailverified:true});
       if(emailexist)
       {
          return{ message: "this email is already exist"}    
       }

        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false,lowerCaseAlphabets: false});
    //    sendMail(Member.email,otp);
       const response=await this.cloudinary.uploadImage(Member.image).catch((error) => {
       throw new BadRequestException(error.message);
    });
      
       const pass = await encryptpassword(Member.password)
           const newMember = new this.MemberModel({
               f_name:Member.f_name,
               l_name:Member.l_name,
               email:Member.email,
               password:pass,
               mobile:Member.mobile,
               image:response.secure_url,   
               otp:otp,
               address:{
                location:Member.address.location,
                city:Member.address.city,
                state:Member.address.state,
                country:Member.address.country,
                zipcode:Member.address.zipcode
               }
           });
           return newMember.save();
   }

   async verify(data:verifydto)
   {
       const findMember = await this.MemberModel.findOne({email:data.email,isemailverified:false,isDeleted:false});
       if(findMember.otp != data.otp)
       {
        return {message:"otp does not match please enter valid otp"}
       }
       await this.MemberModel.findByIdAndUpdate({_id:findMember._id},{isemailverified:true},{new:true});

       return {message:"your email is verified you can login now"}
   }

   async findemailandsaveotp(Memberdto:emailforsendotp)
   {
    const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false,lowerCaseAlphabets: false});
       sendMail(Memberdto.email,otp);
       const Member = await this.MemberModel.findOne({email:Memberdto.email,isemailverified:true,isDeleted:false})
       return await this.MemberModel.findByIdAndUpdate({_id:Member._id},{otp:otp},{new:true});

   }

   async otpverificationforforgotpassword(Memberdto:verifingotp)
   {
       const findMember = await this.MemberModel.findOne({email:Memberdto.email,isemailverified:true,isDeleted:false});
       if(findMember.otp != Memberdto.otp)
       {
        return {message:"otp does not match please enter valid otp"}
       }
       return {message:"successs...."}
   }

   async changepassword(Memberdto:forgotpassword)
   {
       try {
           const Memberdata = await this.MemberModel.findOne({email:Memberdto.email,isDeleted:false,isemailverified:true});
           if(!Memberdata)
           {
               return {message:"Member not found..."}
           }
           if(Memberdto.confirmnewpassword != Memberdto.newpassword)
           {
               return {message:"new password and confirm new password is not same please enter same password"}
           }
           const bcryptpass = await encryptpassword(Memberdto.newpassword);
          
           return this.MemberModel.findByIdAndUpdate({_id:Memberdata._id},{password:bcryptpass},{new:true});
       } 
       catch (error) {
        return {message:error.message}
       }
   }



   
}
