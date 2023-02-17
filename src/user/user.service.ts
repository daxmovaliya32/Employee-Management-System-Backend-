import { BadRequestException, Injectable } from '@nestjs/common';
import {User, UserDocument, UserSchema} from '../models/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model,PaginateModel } from 'mongoose';
import { filterdto, resetpassword, updateusername } from './user.dto';
import { encryptpassword, verifypassword } from 'src/helper/password.helper';
import { CloudinaryService } from 'src/helper/cloudinary/cloudinary.service';

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
export class userservice {
    constructor(
        @InjectModel(User.name) private readonly userModel:Model<UserDocument>,
        @InjectModel(User.name) private readonly usermodelpag:PaginateModel<UserDocument>,
        private readonly cloudinary:CloudinaryService
    ){}

    // for search user by id
    async finduser(id:string)
    {
        try {
            const check= await this.userModel.findOne({_id:id,isDeleted:false,isemailverified:true})
            if(!check)
            {
                return {message:"user not found...."}
            }
            return check;
        } 
        catch (error) {
        console.log(error.message);
        throw new BadRequestException(error.message);
        
        }
    }

    // list all users
    async findall(query:filterdto):Promise<any>
    {      
        let finduser;
        if(query.name != null)
        {
            finduser= this.userModel.find({isDeleted:false, 
                $or:[{f_name:{$regex:query.name,$options:"i"},
                email:{$regex:query.name,$options:"i"},
            }]
        })
        }else{
            finduser= await this.userModel.find({isDeleted:false})
        }
        const options = {
        page: Number(query.page) || 1,
        limit:Number(query.limit) || 10,
        customLabels: myCustomLabels,
      };
      
       return this.usermodelpag.paginate(finduser,options)
    }
    
    // for update user 
    async updateuser(req:any,updatedata:updateusername)
    {   
        try {
            let userfound;
            userfound = await this.userModel.findById({_id:req.user._id,isDeleted:false,isemailverified:true});
            if(!userfound)
            {
                return {message:"user not found...."}
            }
            let check;
            if(updatedata.f_name != null && updatedata.l_name != null)
            {
                check = await this.userModel.findByIdAndUpdate({_id:req.user._id,isDeleted:false,isemailverified:true},{f_name:updatedata.f_name,l_name:updatedata.l_name},{new:true});
            }else if(updatedata.l_name != null)
            {
                check = await this.userModel.findByIdAndUpdate({_id:req.user._id,isDeleted:false,isemailverified:true},{l_name:updatedata.l_name},{new:true});
            }else if(updatedata.f_name != null)
            {
                check = await this.userModel.findByIdAndUpdate({_id:req.user._id,isDeleted:false,isemailverified:true},{f_name:updatedata.f_name},{new:true});
            }
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

    // for reset user password
    async resetpassword(req:any,resetpass:resetpassword)
    {
        try {
            const userdata = await this.userModel.findOne({_id:req.user._id,isDeleted:false,isemailverified:true});
            if(!userdata)
            {
                return {message:"user not found..."}
            }
            const check = await verifypassword(resetpass.oldpassword,userdata.password);
            const bcryptpass = await encryptpassword(resetpass.newpassword);
            if(!check)
            {
                return {message:"password is not correct"}
            }
            return this.userModel.findByIdAndUpdate({_id:req.user._id},{password:bcryptpass},{new:true});
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
        const uploadimage = await this.userModel.findByIdAndUpdate({_id:req.user._id,isDeleted:false,isemailverified:true},{image:res.secure_url},{new:true});
        if(!uploadimage)
        {
            return {message:"user not found....."}
        }
        return uploadimage;
      }
}
