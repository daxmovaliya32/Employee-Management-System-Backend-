import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { query } from 'express';
import { Model, PaginateModel } from 'mongoose';
import { RolesGuardadmin } from 'src/guard/roles.guard';
import { CloudinaryService } from 'src/helper/cloudinary/cloudinary.service';
import { Goal, GoalDocument } from 'src/models/goal.interface';
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
    @InjectModel(Goal.name) private readonly Goalmodelpag:PaginateModel<GoalDocument>,
    private readonly cloudinary:CloudinaryService
  ){}
  async create(createGoalDto:Goal,request:any) {
      const image= await this.cloudinary.uploadImage(createGoalDto.image).catch((error)=>{
        console.log(error);
        throw new BadRequestException(error.message);    
      })
      const org = await this.orgmodel.findOne({org_id:createGoalDto.org_id});
      
      const goaldata = new this.GoalModel({
           user:request.user._id,
           name:createGoalDto.name,
           goal_manager:createGoalDto.goal_manager,
           goal_members:createGoalDto.goal_members,
           org_id:org._id,
           image:image.secure_url,
           desc:createGoalDto.desc,
           progress:createGoalDto.progress
      })
      return goaldata.save();
  }
  
  async findAll(query:filterdto):Promise<any> {
    let findgoal;
    if(query.name != null)
    {
        findgoal= this.GoalModel.find({isDeleted:false, 
            name:{$regex:query.name,$options:"i"}}).populate("user").populate("goal_manager").populate("goal_members").populate("org_id")
    }else{
        findgoal= await this.GoalModel.find({isDeleted:false}).populate("user").populate("goal_manager").populate("goal_members").populate("org_id")
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
