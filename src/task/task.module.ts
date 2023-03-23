import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { CloudinaryModule } from 'src/helper/cloudinary/cloudinary.module';
import { TaskSchema } from 'src/models/task.interface';
import { OrganizationSchema } from 'src/models/organizaton.interface';
import { orguserSchema } from 'src/models/organizationuser.interface';
import { JwtModule } from '@nestjs/jwt';
import { UserSchema } from 'src/models/user.interface';

@Module({
  imports:[CloudinaryModule,NestjsFormDataModule,MongooseModule.forFeature([{name:'Task',schema:TaskSchema}]),MongooseModule.forFeature([{name:'User',schema:UserSchema}]),MongooseModule.forFeature([{name:'Organization',schema:OrganizationSchema}]),MongooseModule.forFeature([{name:'orguser',schema:orguserSchema}]),JwtModule.register({
    secret:process.env.jwtsecret,
})],
  controllers: [TaskController],
  providers: [TaskService]
})
export class TaskModule {}
