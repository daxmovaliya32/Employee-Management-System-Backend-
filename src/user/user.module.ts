import { Module } from '@nestjs/common';
import { userservice } from './user.service';
import { UsercontrollerController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/models/user.interface';
import { NestjsFormDataModule } from 'nestjs-form-data/dist/nestjs-form-data.module';
import { jwtstrategy } from 'src/strategy/jwt.strategy';
import { RolesGuardadmin, RolesGuarduser } from 'src/guard/roles.guard';
import { JwtModule } from '@nestjs/jwt';
import { CloudinaryModule } from 'src/helper/cloudinary/cloudinary.module';

@Module({
  imports: [ CloudinaryModule,NestjsFormDataModule,MongooseModule.forFeature([{name:'User',schema:UserSchema}]),JwtModule.register({
    secret:process.env.jwtsecret,
})],
  providers: [userservice,jwtstrategy,RolesGuardadmin,RolesGuarduser],
  controllers: [UsercontrollerController]
})
export class UserModule {} 
