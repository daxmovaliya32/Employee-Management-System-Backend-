import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel } from 'mongoose';
import { CloudinaryService } from 'src/helper/cloudinary/cloudinary.service';
import { Task, TaskDocument } from 'src/models/Task.interface';
import { orguser, orguserDocument } from 'src/models/organizationuser.interface';
import { Organization, OrganizationDocument } from 'src/models/organizaton.interface';
import { filterdto } from './dto/filter.dto';
import { isEmpty } from 'class-validator';

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
export class TaskService {
  constructor(
    @InjectModel(Task.name) private readonly TaskModel:Model<TaskDocument>,
    @InjectModel(Organization.name) private readonly orgmodel:Model<OrganizationDocument>,
    @InjectModel(orguser.name) private readonly orgusermodel:Model<orguserDocument>,
    @InjectModel(Task.name) private readonly Taskmodelpag:PaginateModel<TaskDocument>,
    private readonly cloudinary:CloudinaryService
  ){}
  async create(createTaskDto:Task,request:any) {
      const image= await this.cloudinary.uploadImage(createTaskDto.image).catch((error)=>{
        console.log(error);
        throw new BadRequestException(error.message);    
      })
      var val=createTaskDto.task_orgusers;
      
      const org = await this.orgmodel.findOne({org_id:createTaskDto.org_id});
      var Taskdata;
      
      if(val==null && createTaskDto.task_manager==null)
      {
        Taskdata = new this.TaskModel({
          user:request.user._id,
          name:createTaskDto.name,
          org_id:org._id,
          image:image.secure_url,
          desc:createTaskDto.desc,
     })
      }else if(val== null)
      {
        Taskdata = new this.TaskModel({
          user:request.user._id,
          name:createTaskDto.name,
          task_manager:createTaskDto.task_manager,
          org_id:org._id,
          image:image.secure_url,
          desc:createTaskDto.desc,
     })
     await this.orgusermodel.findByIdAndUpdate({_id:createTaskDto.task_manager},{role:"Task_Manager"});
      }else if(createTaskDto.task_manager==null)
      {
        Taskdata = new this.TaskModel({
          user:request.user._id,
          name:createTaskDto.name,
          task_orgusers:createTaskDto.task_orgusers,
          org_id:org._id,
          image:image.secure_url,
          desc:createTaskDto.desc,
     })
      createTaskDto.task_orgusers.forEach(async(ele)=>{
        await this.orgusermodel.findByIdAndUpdate({_id:ele},{role:"Task_orguser"})
      })
      }else{
        Taskdata = new this.TaskModel({
          user:request.user._id,
          name:createTaskDto.name,
          task_manager:createTaskDto.task_manager,
          task_orgusers:createTaskDto.task_orgusers,
          org_id:org._id,
          image:image.secure_url,
          desc:createTaskDto.desc,
     })
     await this.orgusermodel.findByIdAndUpdate({_id:createTaskDto.task_manager},{role:"Task_Manager"});
      createTaskDto.task_orgusers.forEach(async(ele)=>{
        await this.orgusermodel.findByIdAndUpdate({_id:ele},{role:"Task_orguser"})
      })
      }
      
      return Taskdata.save();
  }
  
  async findAll(query:filterdto):Promise<any> {
    let findTask;
    if(query.name != null)
    {
        findTask= this.TaskModel.find({isDeleted:false, 
            name:{$regex:query.name,$options:"i"}}).populate("user").populate("task_manager").populate("task_orgusers").populate("org_id")
    }else{
        findTask= await this.TaskModel.find({isDeleted:false}).populate("user").populate("task_manager").populate("task_orgusers").populate("org_id")
    }
    const options = {
    page: Number(query.page) || 1,
    limit:Number(query.limit) || 10,
    customLabels: myCustomLabels,
  };
  
   return this.Taskmodelpag.paginate(findTask,options)
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  update(id: number, updateTaskDto:any) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
