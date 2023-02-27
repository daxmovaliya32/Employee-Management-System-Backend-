import { Module } from '@nestjs/common';
import { GoalService } from './goal.service';
import { GoalController } from './goal.controller';
import { CloudinaryModule } from 'src/helper/cloudinary/cloudinary.module';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { MongooseModule } from '@nestjs/mongoose';
import { GoalSchema } from 'src/models/goal.interface';
import { JwtModule } from '@nestjs/jwt';
import { OrganizationSchema } from 'src/models/organizaton.interface';

@Module({
  imports:[CloudinaryModule,NestjsFormDataModule,MongooseModule.forFeature([{name:'Goal',schema:GoalSchema}]),MongooseModule.forFeature([{name:'Organization',schema:OrganizationSchema}]),JwtModule.register({
    secret:process.env.jwtsecret,
})],
  controllers: [GoalController],
  providers: [GoalService]
})
export class GoalModule {}
