import { Prop,Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  IsNotEmpty,
  MinLength,
} from 'class-validator';
import mongoose,{ Document } from 'mongoose';
import * as paginate from 'mongoose-paginate-v2';
import { Goal } from './goal.interface';
import { Organization } from './organizaton.interface';
import { Task } from './task.interface';
import { Team } from './team.interface';
import { User } from './user.interface';

export class address {
  @IsNotEmpty()
  location: string;

  @IsNotEmpty()
  city: string;

  @IsNotEmpty()
  state: string;

  @IsNotEmpty()
  country: string;

  @IsNotEmpty()
  @MinLength(6)
  zipcode: number;
}

export type DepartmentDocument = Department & Document;
@Schema({ timestamps: true, collection: 'Department' })
export class Department {
  @Prop({type:mongoose.Schema.Types.ObjectId,ref:"users"})
  @IsNotEmpty()
  user:User;

  @Prop()
  @IsNotEmpty()
  name: string;

  @Prop({ type: String })
  @IsNotEmpty()
  image: any;

  @Prop()
  desc: string;

  @Prop({type:mongoose.Schema.Types.ObjectId,ref:"users"})
  department_manager:User;

  @Prop({type:mongoose.Schema.Types.ObjectId,ref:"users"})
  department_members:User;

  @Prop({type:mongoose.Schema.Types.ObjectId,ref:"Goal"})
  department_goals:Goal;

  @Prop({type:mongoose.Schema.Types.ObjectId,ref:"Task"})
  department_tasks:Task;

  @Prop({type:mongoose.Schema.Types.ObjectId,ref:"Organization"})
  org_id:Organization;

  @Prop({type:mongoose.Schema.Types.ObjectId,ref:"Team"})
  department_team:Team;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: 1 })
  status: boolean;

  @Prop({ default: false })
  isActive: boolean;

}

export const DepartmentSchema = SchemaFactory.createForClass(Department);
DepartmentSchema.plugin(paginate);