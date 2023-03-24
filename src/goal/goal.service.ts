import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { query } from 'express';
import { Model, PaginateModel } from 'mongoose';
import { RolesGuardadmin } from 'src/guard/roles.guard';
import { CloudinaryService } from 'src/helper/cloudinary/cloudinary.service';
import { Goal, GoalDocument } from 'src/models/goal.interface';
import { orguser, orguserDocument } from 'src/models/organizationuser.interface';
import { Organization, OrganizationDocument } from 'src/models/organizaton.interface';
import { User, UserDocument } from 'src/models/user.interface';
import { filterdto } from 'src/user/user.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';

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
export class GoalService {
  constructor(
    @InjectModel(Goal.name) private readonly GoalModel:Model<GoalDocument>,
    @InjectModel(Organization.name) private readonly orgmodel:Model<OrganizationDocument>,
    @InjectModel(orguser.name) private readonly orgusermodel:Model<orguserDocument>,
    @InjectModel(Goal.name) private readonly Goalmodelpag:PaginateModel<GoalDocument>,
    private readonly cloudinary:CloudinaryService
  ){}
  async create(createGoalDto:Goal,request:any) {
      const image= await this.cloudinary.uploadImage(createGoalDto.image).catch((error)=>{
        console.log(error);
        throw new BadRequestException(error.message);    
      })
      const org = await this.orgmodel.findOne({org_id:createGoalDto.org_id});
      var goaldata;
      if(createGoalDto.goal_orgusers==null && createGoalDto.goal_manager==null)
      {
        goaldata = new this.GoalModel({
          user:request.user._id,
          name:createGoalDto.name,
          org_id:org._id,
          image:image.secure_url,
          desc:createGoalDto.desc,
          progress:createGoalDto.progress
     })
      }
      else if(createGoalDto.goal_orgusers== null)
      {
        goaldata = new this.GoalModel({
          user:request.user._id,
          name:createGoalDto.name,
          goal_manager:createGoalDto.goal_manager,
          org_id:org._id,
          image:image.secure_url,
          desc:createGoalDto.desc,
          progress:createGoalDto.progress
     })
     await this.orgusermodel.findByIdAndUpdate({_id:createGoalDto.goal_manager},{role:"Goal_Manager"});
      }else if(createGoalDto.goal_manager==null)
      {
        goaldata = new this.GoalModel({
          user:request.user._id,
          name:createGoalDto.name,
          goal_orgusers:createGoalDto.goal_orgusers,
          org_id:org._id,
          image:image.secure_url,
          desc:createGoalDto.desc,
          progress:createGoalDto.progress
     })
     createGoalDto.goal_orgusers.forEach(async(ele)=>{
      await this.orgusermodel.findByIdAndUpdate({_id:ele},{role:"Goal_orguser"})
    })
      }else{
        goaldata = new this.GoalModel({
          user:request.user._id,
          name:createGoalDto.name,
          goal_manager:createGoalDto.goal_manager,
          goal_orgusers:createGoalDto.goal_orgusers,
          org_id:org._id,
          image:image.secure_url,
          desc:createGoalDto.desc,
          progress:createGoalDto.progress
     })   
     await this.orgusermodel.findByIdAndUpdate({_id:createGoalDto.goal_manager},{role:"Goal_Manager"});
     createGoalDto.goal_orgusers.forEach(async(ele)=>{
       await this.orgusermodel.findByIdAndUpdate({_id:ele},{role:"Goal_orguser"})
     })
    }
     return goaldata.save();
  }
  
  async findAll(query:filterdto):Promise<any> {
    let findgoal;
    if(query.name != null)
    {
        findgoal= this.GoalModel.find({isDeleted:false, 
            name:{$regex:query.name,$options:"i"}}).populate("user").populate("goal_manager").populate("goal_orgusers").populate("org_id")
    }else{
        findgoal= await this.GoalModel.find({isDeleted:false}).populate("user").populate("goal_manager").populate("goal_orgusers").populate("org_id")
    }
    const options = {
    page: Number(query.page) || 1,
    limit:Number(query.limit) || 10,
    customLabels: myCustomLabels,
  };
  
   return this.Goalmodelpag.paginate(findgoal,options)
  }

  findOne(id: number) {
    return `This action returns a #${id} goal`;
  }

  update(id: number, updateGoalDto: UpdateGoalDto) {
    return `This action updates a #${id} goal`;
  }

  remove(id: number) {
    return `This action removes a #${id} goal`;
  }
}
