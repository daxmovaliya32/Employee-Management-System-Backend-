import { BadRequestException, Injectable } from '@nestjs/common';
import { idgenrate } from 'src/helper/randomid.genrate';
import { Organization, OrganizationDocument } from 'src/models/organizaton.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model,PaginateModel } from 'mongoose';
import { CloudinaryService } from 'src/helper/cloudinary/cloudinary.service';
import { filterdto } from 'src/user/user.dto';

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
export class OrgenizationService {
  constructor(
    @InjectModel(Organization.name) private readonly OrganizationModel:Model<OrganizationDocument>,
    @InjectModel(Organization.name) private readonly Organizationmodelpag:PaginateModel<OrganizationDocument>,
    private readonly cloudinary:CloudinaryService
  ){}
  async create(createOrgenizationDto: Organization,req:any) {
    const uniqueId = await idgenrate();
    console.log((uniqueId));
    
    const image = await this.cloudinary.uploadImage(createOrgenizationDto.image).catch((error) => {
      console.log(error);
    throw new BadRequestException(error.message);    
  });
    const orgdata = new this.OrganizationModel({
          user:req.user._id,
          name:createOrgenizationDto.name,
          title:createOrgenizationDto.title,
          desc:createOrgenizationDto.desc,
          orgid:uniqueId,
          image:image.secure_url
    })
    return orgdata.save();
  }

  async findall(query:filterdto):Promise<any>
  {      
      let findorganization;
      if(query.name != null)
      {
          findorganization= this.OrganizationModel.find({isDeleted:false, 
             name:{$regex:query.name,$options:"i"}})
      }else{
          findorganization= await this.OrganizationModel.find({isDeleted:false})
      }
      
      const options = {
      page: Number(query.page) || 1,
      limit:Number(query.limit) || 10,
      customLabels: myCustomLabels,
    };
    
     return this.Organizationmodelpag.paginate(findorganization,options)
  }

  async findbyid(id:string) {
    try {
      const check= await this.OrganizationModel.findOne({_id:id,isDeleted:false,isemailverified:true})
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

  update(id: number, updateOrgenizationDto: any) {
    return `This action updates a #${id} orgenization`;
  }

  async remove(id:string) {
    return await this.OrganizationModel.findByIdAndUpdate({_id:id},{isDeleted:true},{new:true});
  }
}
