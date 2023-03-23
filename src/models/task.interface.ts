import { Prop,Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  IsNotEmpty,
} from 'class-validator';
import mongoose,{ Document } from 'mongoose';
import * as paginate from 'mongoose-paginate-v2';
import { orguser } from './organizationuser.interface';
import { Organization } from './organizaton.interface';
import { User } from './user.interface';

export type TaskDocument = Task & Document;
@Schema({ timestamps: true, collection: 'Task' })
export class Task {
  @Prop({type:mongoose.Schema.Types.ObjectId,ref:"User"})
  user:User;

  @Prop()
  @IsNotEmpty()
  name: string;

  @Prop({type:mongoose.Schema.Types.ObjectId,ref:"orguser"})
  @IsNotEmpty()
  task_manager:orguser;

  @Prop([{type:mongoose.Schema.Types.ObjectId,ref:"orguser"}])
  @IsNotEmpty()
  task_members:orguser[];

  @Prop({type:mongoose.Schema.Types.ObjectId,ref:"Organization"})
  @IsNotEmpty()
  org_id:Organization;

  @Prop()
  @IsNotEmpty()
  desc: string;

  @Prop({ type: String })
  @IsNotEmpty()
  image: any;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: false })
  isComplete: boolean;

  @Prop({ default: 1 })
  status: boolean;

}

export const TaskSchema = SchemaFactory.createForClass(Task);
TaskSchema.plugin(paginate);
