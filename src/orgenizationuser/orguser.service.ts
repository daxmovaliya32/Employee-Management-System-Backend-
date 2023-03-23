import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model,PaginateModel } from 'mongoose';
import { filterdto, resetpassword, updateorgusername } from './orguser.dto';
import { encryptpassword, verifypassword } from 'src/helper/password.helper';
import { CloudinaryService } from 'src/helper/cloudinary/cloudinary.service';
import { orguser, orguserDocument } from 'src/models/organizationuser.interface';
import { JwtService } from '@nestjs/jwt';
import { Organization, OrganizationDocument } from 'src/models/organizaton.interface';
const otpGenerator = require('otp-generator')

const myCustomLabels = {
    totalDocs: 'itemCount',
    docs: 'itemsList',
    limit: 'perPage',
    page: 'currentPage',
    nextPage: 'next',
    prevPage: 'prev',
    totalPages: 'pageCount',
    pagingCounter: 'slNo',
    meta: 'paginator',
  };

@Injectable()
export class orguserservice {
    constructor(
        @InjectModel(orguser.name) private readonly orguserModel:Model<orguserDocument>,
        @InjectModel(orguser.name) private readonly orgusermodelpag:PaginateModel<orguserDocument>,
        @InjectModel(Organization.name) private readonly OrganizationModel:Model<OrganizationDocument>,
        private readonly cloudinary:CloudinaryService,
        private readonly jwtService:JwtService,
    ){}

    async addorguser(req:any,user:orguser)
    {  
        const emailexist =await this.orguserModel.findOne({email:user.email,isDeleted:false});
        if(emailexist)
        {
           return{ message: "this email is already exist"}    
        }
        const orgid = await this.OrganizationModel.findOne({user:req.user._id,isDeleted:false});
        const pass = await encryptpassword(user.password)
            const newuser = new this.orguserModel({
                name:user.name,
                dob:user.dob,
                join_date:user.join_date,
                email:user.email,
                password:pass,
                orgid:orgid,
                mobile:user.mobile,  
                address:{
                 location:user.address.location,
                 city:user.address.city,
                 state:user.address.state,
                 country:user.address.country,
                 zipcode:user.address.zipcode
                }
            });
            return newuser.save();
    }

    async signinuser(email:string,password:string)
    {
        try{   
            let check;   
            check = await this.orguserModel.findOne({email:email});
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


    // for search orguser by id
    async findorguser(id:string)
    {
        try {
            const check= await this.orguserModel.findOne({_id:id,isDeleted:false,isemailverified:true})
            if(!check)
            {
                return {message:"orguser not found...."}
            }
            return check;
        } 
        catch (error) {
        console.log(error.message);
        throw new BadRequestException(error.message);
        
        }
    }

    // list all orgusers
    async findall(query:filterdto)
    {      
        let findorguser;
        if(query.name != null)
        {
            findorguser= this.orguserModel.find({isDeleted:false, 
                $or:[{f_name:{$regex:query.name,$options:"i"},
                email:{$regex:query.name,$options:"i"},
            }]
        })
        }else{
            findorguser= await this.orguserModel.find({isDeleted:false})
        }
        const options = {
        page: Number(query.page) || 1,
        limit:Number(query.limit) || 10,
        customLabels: myCustomLabels,
      };
      
       return this.orgusermodelpag.paginate(findorguser,options)
    }
    
    // for update orguser 
    async updateorguser(req:any,updatedata:updateorgusername)
    {   
        try {
            let orguserfound;
            orguserfound = await this.orguserModel.findById({_id:req.orguser._id,isDeleted:false});
            if(!orguserfound)
            {
                return {message:"orguser not found...."}
            }
            let check = await this.orguserModel.findByIdAndUpdate({_id:req.orguser._id,isDeleted:false},{name:updatedata.name},{new:true});

            if(!check)
            {
                return {message:"you dont change anythig..."}
            }
            return check;
        } 
        catch (error) {
        console.log(error);
        }
    }

    // for reset orguser password
    async resetpassword(req:any,resetpass:resetpassword)
    {
        try {
            const orguserdata = await this.orguserModel.findOne({_id:req.orguser._id,isDeleted:false,isemailverified:true});
            if(!orguserdata)
            {
                return {message:"orguser not found..."}
            }
            const check = await verifypassword(resetpass.oldpassword,orguserdata.password);
            const bcryptpass = await encryptpassword(resetpass.newpassword);
            if(!check)
            {
                return {message:"password is not correct"}
            }
            return this.orguserModel.findByIdAndUpdate({_id:req.orguser._id},{password:bcryptpass},{new:true});
        } 
        catch (error) {
        console.log(error);
        }
    }

    async updateprofile(req:any) {
        const res = await this.cloudinary.uploadImage(req.file).catch((error) => {
            console.log(error);
          throw new BadRequestException(error.message);    
        });
        const uploadimage = await this.orguserModel.findByIdAndUpdate({_id:req.orguser._id,isDeleted:false,isemailverified:true},{image:res.secure_url},{new:true});
        if(!uploadimage)
        {
            return {message:"orguser not found....."}
        }
        return uploadimage;
      }

    
}
