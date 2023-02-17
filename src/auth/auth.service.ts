import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { encryptpassword, verifypassword } from '../helper/password.helper';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/models/user.interface';
import { JwtService } from '@nestjs/jwt';
import { CloudinaryService } from 'src/helper/cloudinary/cloudinary.service';
const otpGenerator = require('otp-generator')
import * as dotenv from 'dotenv';
import { sendMail } from './sendmail';
import { verifydto } from 'src/user/user.dto';
import { emailforsendotp, forgotpassword, verifingotp } from './auth.dto';

dotenv.config(); 

@Injectable()
export class AuthService {
    constructor(
        @InjectModel('User') private readonly userModel:Model<UserDocument>,
        private readonly jwtService:JwtService,
        private readonly cloudinary: CloudinaryService
    ){}

    //for login user
    async signinuser(email:string,password:string)
    {
        try{      
            const check = await this.userModel.findOne({email:email});
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
            return {user:check.email,access_token:token};
        
        } catch (error) {
            console.log(error);
            
        }
   }

   //for register user
   async signupuser(user:User)
   {  
       const emailexist =await this.userModel.findOne({email:user.email,isemailverified:true});
       if(emailexist)
       {
          return{ message: "this email is already exist"}    
       }

        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false,lowerCaseAlphabets: false});
    //    sendMail(user.email,otp);
       const response=await this.cloudinary.uploadImage(user.image).catch((error) => {
       throw new BadRequestException(error.message);
    });
      
       const pass = await encryptpassword(user.password)
           const newUser = new this.userModel({
               f_name:user.f_name,
               l_name:user.l_name,
               email:user.email,
               password:pass,
               mobile:user.mobile,
               image:response.secure_url,   
               otp:otp,
               address:{
                location:user.address.location,
                city:user.address.city,
                state:user.address.state,
                country:user.address.country,
                zipcode:user.address.zipcode
               }
           });
           return newUser.save();
   }

   async verify(data:verifydto)
   {
       const finduser = await this.userModel.findOne({email:data.email,isemailverified:false,isDeleted:false});
       if(finduser.otp != data.otp)
       {
        return {message:"otp does not match please enter valid otp"}
       }
       await this.userModel.findByIdAndUpdate({_id:finduser._id},{isemailverified:true},{new:true});

       return {message:"your email is verified you can login now"}
   }

   async findemailandsaveotp(userdto:emailforsendotp)
   {
    const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false,lowerCaseAlphabets: false});
       sendMail(userdto.email,otp);
       const user = await this.userModel.findOne({email:userdto.email,isemailverified:true,isDeleted:false})
       return await this.userModel.findByIdAndUpdate({_id:user._id},{otp:otp},{new:true});

   }

   async otpverificationforforgotpassword(userdto:verifingotp)
   {
       const finduser = await this.userModel.findOne({email:userdto.email,isemailverified:true,isDeleted:false});
       if(finduser.otp != userdto.otp)
       {
        return {message:"otp does not match please enter valid otp"}
       }
       return {message:"successs...."}
   }

   async changepassword(userdto:forgotpassword)
   {
       try {
           const userdata = await this.userModel.findOne({email:userdto.email,isDeleted:false,isemailverified:true});
           if(!userdata)
           {
               return {message:"user not found..."}
           }
           if(userdto.confirmnewpassword != userdto.newpassword)
           {
               return {message:"new password and confirm new password is not same please enter same password"}
           }
           const bcryptpass = await encryptpassword(userdto.newpassword);
          
           return this.userModel.findByIdAndUpdate({_id:userdata._id},{password:bcryptpass},{new:true});
       } 
       catch (error) {
        return {message:error.message}
       }
   }



   
}
