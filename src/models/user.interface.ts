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

export type UserDocument = User & Document;
@Schema({ timestamps: true, collection: 'users' })
export class User {
  @Prop()
  @IsNotEmpty()
  f_name: string;

  @Prop()
  @IsNotEmpty()
  l_name: string;

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

  @Prop({ default: 'User' })
  role: string;

  @Prop()
  @IsMobilePhone()
  mobile: number;

  @Prop({ type: String })
  @IsNotEmpty()
  image: any;

  @Prop({ default: false })
  isemailverified: boolean;

  @Prop({ default: false })
  ismobileverified: boolean;

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

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.plugin(paginate);