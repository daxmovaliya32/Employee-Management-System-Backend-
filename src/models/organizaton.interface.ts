import { Prop,Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  IsNotEmpty,
  MinLength,
} from 'class-validator';
import mongoose,{ Document } from 'mongoose';
import * as paginate from 'mongoose-paginate-v2';
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

export type OrganizationDocument = Organization & Document;
@Schema({ timestamps: true, collection: 'Organization' })
export class Organization {
  @Prop({type:mongoose.Schema.Types.ObjectId,ref:"users"})
  user:User;

  @Prop()
  @IsNotEmpty()
  name: string;

  @Prop()
  @IsNotEmpty()
  title: string;

  @Prop()
  orgid:string;

  @Prop()
  desc: string;

  @Prop({ type: String })
  @IsNotEmpty()
  image: any;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: 1 })
  status: boolean;

  @Prop({ default: false })
  isActive: boolean;

}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
OrganizationSchema.plugin(paginate);