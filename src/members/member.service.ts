import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model,PaginateModel } from 'mongoose';
import { filterdto, resetpassword, updatemembername } from './member.dto';
import { encryptpassword, verifypassword } from 'src/helper/password.helper';
import { CloudinaryService } from 'src/helper/cloudinary/cloudinary.service';
import { Member, MemberDocument } from 'src/models/member.interface';

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
export class memberservice {
    constructor(
        @InjectModel(Member.name) private readonly MemberModel:Model<MemberDocument>,
        @InjectModel(Member.name) private readonly Membermodelpag:PaginateModel<MemberDocument>,
        private readonly cloudinary:CloudinaryService
    ){}

    // for search member by id
    async findmember(id:string)
    {
        try {
            const check= await this.MemberModel.findOne({_id:id,isDeleted:false,isemailverified:true})
            if(!check)
            {
                return {message:"member not found...."}
            }
            return check;
        } 
        catch (error) {
        console.log(error.message);
        throw new BadRequestException(error.message);
        
        }
    }

    // list all members
    async findall(query:filterdto)
    {      
        let findmember;
        if(query.name != null)
        {
            findmember= this.MemberModel.find({isDeleted:false, 
                $or:[{f_name:{$regex:query.name,$options:"i"},
                email:{$regex:query.name,$options:"i"},
            }]
        })
        }else{
            findmember= await this.MemberModel.find({isDeleted:false})
        }
        const options = {
        page: Number(query.page) || 1,
        limit:Number(query.limit) || 10,
        customLabels: myCustomLabels,
      };
      
       return this.Membermodelpag.paginate(findmember,options)
    }
    
    // for update member 
    async updatemember(req:any,updatedata:updatemembername)
    {   
        try {
            let memberfound;
            memberfound = await this.MemberModel.findById({_id:req.member._id,isDeleted:false,isemailverified:true});
            if(!memberfound)
            {
                return {message:"member not found...."}
            }
            let check;
            if(updatedata.f_name != null && updatedata.l_name != null)
            {
                check = await this.MemberModel.findByIdAndUpdate({_id:req.member._id,isDeleted:false,isemailverified:true},{f_name:updatedata.f_name,l_name:updatedata.l_name},{new:true});
            }else if(updatedata.l_name != null)
            {
                check = await this.MemberModel.findByIdAndUpdate({_id:req.member._id,isDeleted:false,isemailverified:true},{l_name:updatedata.l_name},{new:true});
            }else if(updatedata.f_name != null)
            {
                check = await this.MemberModel.findByIdAndUpdate({_id:req.member._id,isDeleted:false,isemailverified:true},{f_name:updatedata.f_name},{new:true});
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

    // for reset member password
    async resetpassword(req:any,resetpass:resetpassword)
    {
        try {
            const memberdata = await this.MemberModel.findOne({_id:req.member._id,isDeleted:false,isemailverified:true});
            if(!memberdata)
            {
                return {message:"member not found..."}
            }
            const check = await verifypassword(resetpass.oldpassword,memberdata.password);
            const bcryptpass = await encryptpassword(resetpass.newpassword);
            if(!check)
            {
                return {message:"password is not correct"}
            }
            return this.MemberModel.findByIdAndUpdate({_id:req.member._id},{password:bcryptpass},{new:true});
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
        const uploadimage = await this.MemberModel.findByIdAndUpdate({_id:req.member._id,isDeleted:false,isemailverified:true},{image:res.secure_url},{new:true});
        if(!uploadimage)
        {
            return {message:"member not found....."}
        }
        return uploadimage;
      }
}
