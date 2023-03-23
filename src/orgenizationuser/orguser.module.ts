import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NestjsFormDataModule } from 'nestjs-form-data/dist/nestjs-form-data.module';
import { jwtstrategy } from 'src/strategy/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { CloudinaryModule } from 'src/helper/cloudinary/cloudinary.module';
import { orguserSchema } from 'src/models/organizationuser.interface';
import { orgusercontrollerController } from './orguser.controller';
import { orguserservice } from './orguser.service';
import { RolesGuardorguser } from 'src/guard/roles.guard';
import { OrganizationSchema } from 'src/models/organizaton.interface';

@Module({
  imports: [CloudinaryModule,NestjsFormDataModule,MongooseModule.forFeature([{name:'Organization',schema:OrganizationSchema}]),MongooseModule.forFeature([{name:'orguser',schema:orguserSchema}]),JwtModule.register({
    secret:process.env.jwtsecret,
})],
  providers: [orguserservice,jwtstrategy,RolesGuardorguser],
  controllers: [orgusercontrollerController]
})
export class orguserModule {} 
