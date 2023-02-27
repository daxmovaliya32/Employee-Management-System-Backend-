import { Prop,Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  IsNotEmpty,
} from 'class-validator';
import mongoose,{ Document } from 'mongoose';
import * as paginate from 'mongoose-paginate-v2';
import { Organization } from './organizaton.interface';
import { User } from './user.interface';

export type GoalDocument = Goal & Document;
@Schema({ timestamps: true, collection: 'Goal' })
export class Goal {
  @Prop({type:mongoose.Schema.Types.ObjectId,ref:"User"})
  user:User;

  @Prop()
  @IsNotEmpty()
  name: string;

  @Prop({type:mongoose.Schema.Types.ObjectId,ref:"User"})
  @IsNotEmpty()
  goal_manager:User;

  @Prop([{type:mongoose.Schema.Types.ObjectId,ref:"User"}])
  @IsNotEmpty()
  goal_members:User[];

  @Prop({type:mongoose.Schema.Types.ObjectId,ref:"Organization"})
  @IsNotEmpty()
  org_id:Organization;

  @Prop()
  @IsNotEmpty()
  desc: string;

  @Prop()
  @IsNotEmpty()
  progress:string;

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

export const GoalSchema = SchemaFactory.createForClass(Goal);
GoalSchema.plugin(paginate);