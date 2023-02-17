import { Prop,Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  IsNotEmpty,
  MinLength,
} from 'class-validator';
import mongoose,{ Document } from 'mongoose';
import * as paginate from 'mongoose-paginate-v2';
import { Organization } from './organizaton.interface';
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

export type TaskDocument = Task & Document;
@Schema({ timestamps: true, collection: 'Task' })
export class Task {
  @Prop({type:mongoose.Schema.Types.ObjectId,ref:"users"})
  @IsNotEmpty()
  user:User;

  @Prop()
  @IsNotEmpty()
  name: string;

  @Prop({type:mongoose.Schema.Types.ObjectId,ref:"users"})
  task_manager:User;

  @Prop({type:mongoose.Schema.Types.ObjectId,ref:"users"})
  task_members:User;

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
  isComplete: boolean;

  @Prop({ default: 1 })
  status: boolean;

}

export const TaskSchema = SchemaFactory.createForClass(Task);
TaskSchema.plugin(paginate);
