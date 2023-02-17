import { Prop,Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  IsNotEmpty,
} from 'class-validator';
import mongoose,{ Document } from 'mongoose';
import * as paginate from 'mongoose-paginate-v2';
import { Goal } from './goal.interface';
import { Organization } from './organizaton.interface';
import { Task } from './task.interface';
import { User } from './user.interface';

export type TeamDocument = Team & Document;
@Schema({ timestamps: true, collection: 'Team' })
export class Team {
  @Prop({type:mongoose.Schema.Types.ObjectId,ref:"users"})
  @IsNotEmpty()
  user:User;

  @Prop()
  @IsNotEmpty()
  name: string;

  @Prop({type:mongoose.Schema.Types.ObjectId,ref:"users"})
  project_manager:User;

  @Prop({type:mongoose.Schema.Types.ObjectId,ref:"users"})
  project_members:User;

  @Prop({type:mongoose.Schema.Types.ObjectId,ref:"Goal"})
  projet_goals:Goal;

  @Prop({type:mongoose.Schema.Types.ObjectId,ref:"Task"})
  project_task:Task;

  @Prop({type:mongoose.Schema.Types.ObjectId,ref:"Team"})
  department_team:Team;

  @Prop({type:mongoose.Schema.Types.ObjectId,ref:"Organization"})
  org_id:Organization;

  @Prop()
  desc: string;

  @Prop({ type: String })
  @IsNotEmpty()
  image: any;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: false })
  isActive: boolean;

  @Prop({ default: 1 })
  status: boolean;

}

export const TeamSchema = SchemaFactory.createForClass(Team);
TeamSchema.plugin(paginate);
