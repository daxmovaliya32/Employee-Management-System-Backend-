import { Prop,Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import * as paginate from "mongoose-paginate-v2";
import {
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  Matches,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Document } from 'mongoose';

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

export type orguserDocument = orguser & Document;
@Schema({ timestamps: true, collection: 'orgusers' })
export class orguser {
  @Prop()
  @IsNotEmpty()
  name: string;

  @Prop()
  @IsNotEmpty()
  dob: Date;

  @Prop()
  @IsNotEmpty()
  join_date: Date;

  @Prop()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Prop()
  @IsNotEmpty()
  @MinLength(4)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password: string;

  @Prop({ default: 'orguser' })
  role: string;

  @Prop()
  @IsMobilePhone()
  mobile: number;

  @Prop({ type: String })
  image: any;

  @Prop()
  orgid: string;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: 1 })
  status: boolean;

  @Prop({type:address})
  @ValidateNested({ each: true })
  @Type(() => address)
  address:address

  @Prop()
  otp: number;
}

export const orguserSchema = SchemaFactory.createForClass(orguser);
orguserSchema.plugin(paginate);