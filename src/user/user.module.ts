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
import { orguserSchema } from 'src/models/organizationuser.interface';
import { OrganizationSchema } from 'src/models/organizaton.interface';

@Module({
  imports: [ CloudinaryModule,NestjsFormDataModule,MongooseModule.forFeature([{name:'Organization',schema:OrganizationSchema}]),MongooseModule.forFeature([{name:'User',schema:UserSchema}]),MongooseModule.forFeature([{name:'orguser',schema:orguserSchema}]),JwtModule.register({
    secret:process.env.jwtsecret,
})],
  providers: [userservice,jwtstrategy,RolesGuardadmin,RolesGuarduser],
  controllers: [UsercontrollerController]
})
export class UserModule {} 
