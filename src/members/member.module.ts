import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NestjsFormDataModule } from 'nestjs-form-data/dist/nestjs-form-data.module';
import { jwtstrategy } from 'src/strategy/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { CloudinaryModule } from 'src/helper/cloudinary/cloudinary.module';
import { MemberSchema } from 'src/models/member.interface';
import { membercontrollerController } from './member.controller';
import { memberservice } from './member.service';

@Module({
  imports: [ CloudinaryModule,NestjsFormDataModule,MongooseModule.forFeature([{name:'Member',schema:MemberSchema}]),JwtModule.register({
    secret:process.env.jwtsecret,
})],
  providers: [memberservice,jwtstrategy],
  controllers: [membercontrollerController]
})
export class MemberModule {} 
