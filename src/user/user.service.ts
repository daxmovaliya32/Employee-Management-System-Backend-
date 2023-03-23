import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import {User, UserDocument, UserSchema} from '../models/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model,PaginateModel } from 'mongoose';
import { carddto, filterdto, resetpassword, updateusername } from './user.dto';
import { encryptpassword, verifypassword } from 'src/helper/password.helper';
import { CloudinaryService } from 'src/helper/cloudinary/cloudinary.service';
import { orguser, orguserDocument } from 'src/models/organizationuser.interface';
import { Organization, OrganizationDocument } from 'src/models/organizaton.interface';
const Stripe = require('stripe')(process.env.stripe_sk);

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
        @InjectModel(orguser.name) private readonly orguserModel:Model<orguserDocument>,
        @InjectModel(orguser.name) private readonly orgusermodelpag:PaginateModel<orguserDocument>,
        @InjectModel(Organization.name) private readonly OrganizationModel:Model<OrganizationDocument>,
        // @InjectStripe() private readonly stripeClient: Stripe,
        private readonly cloudinary:CloudinaryService
    ){}

    // for search user by id
    async finduser(req:any,id:string)
    {
        try {
            const orgid = await this.OrganizationModel.findOne({user:req.user._id,isDeleted:false});
            const check= await this.orguserModel.findOne({_id:id,orgid:orgid.orgid,isDeleted:false})
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
    async findall(req:any,query:filterdto):Promise<any>
    {      
        // const userdata = await this.userModel.findOne({_id:req.orguser._id,isDeleted:false});
        let finduser;
        const orgid = await this.OrganizationModel.findOne({user:req.user._id,isDeleted:false});
        if(query.name != null)
        {
            finduser= this.orguserModel.find({orgid:orgid.orgid,isDeleted:false, 
                $or:[{f_name:{$regex:query.name,$options:"i"},
                email:{$regex:query.name,$options:"i"},
            }]
        })
        }else{
            finduser= await this.orguserModel.find({orgid:orgid.orgid,isDeleted:false})
        }
        const options = {
        page: Number(query.page) || 1,
        limit:Number(query.limit) || 10,
        customLabels: myCustomLabels,
      };
      console.log(orgid.orgid);
      
       return this.orgusermodelpag.paginate(finduser,options)
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
            var check; 
            console.log(updatedata.f_name);
            
            if(updatedata.f_name != null && updatedata.l_name != null)
            {
                check = await this.userModel.findByIdAndUpdate({_id:req.user._id,isDeleted:false,isemailverified:true},{f_name:updatedata.f_name,l_name:updatedata.l_name},{new:true});
                
                
            }else if(updatedata.l_name != null)
            {
                check = await this.userModel.findByIdAndUpdate({_id:userfound._id,isDeleted:false,isemailverified:true},{l_name:updatedata.l_name},{new:true});
            }else if(updatedata.f_name != null)
            {
                check = await this.userModel.findByIdAndUpdate({_id:userfound._id,isDeleted:false,isemailverified:true},{f_name:updatedata.f_name},{new:true});
            } 
            console.log(check);
            
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

      async subscription(req:any,subid:string,carddto:carddto)
    {
        var tid;
        console.log(subid);
        
        const userdata = await this.userModel.findOne({_id:req.user._id,isDeleted:false,isemailverified:true});
        var cid=userdata.customerid;
        await Stripe.tokens.create({
        card:{ 
        number: carddto.number,
        exp_month: carddto.exp_month,
        exp_year: carddto.exp_year,
        cvc: carddto.cvc,}}).then((token)=>{tid=token.id; console.log(token);
        }).catch((err)=>{console.log(err)});
        await Stripe.customers.createSource(cid,{source:tid}).catch((err)=>{console.log(err)});
        
        const check = await Stripe.paymentIntents.create({amount:1000,currency:"INR",description:"payment",payment_method_types: ['card']}).catch((err)=>{console.log(err);});
        if(check){  
            try {
                await this.userModel.findByIdAndUpdate({_id:userdata._id,isDeleted:false,isemailverified:true},{subscribe:true},{new:true});
                return await Stripe.subscriptions.create({
                  customer: userdata.customerid,
                  items: [
                    {
                      price:subid
                    }
                  ]
                })
              } catch (error) {
                if (error) {
                    console.log(error);
                  throw new BadRequestException('Credit card not set up');
                }
                throw new InternalServerErrorException();
              }
        }  else{
            return {Message:"its not success" }
        } 
       
    }
}
