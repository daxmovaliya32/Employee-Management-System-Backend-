import { Module } from '@nestjs/common';
import { OrgenizationService } from './orgenization.service';
import { OrgenizationController } from './orgenization.controller';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryModule } from 'src/helper/cloudinary/cloudinary.module';
import { OrganizationSchema } from 'src/models/organizaton.interface';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[CloudinaryModule,NestjsFormDataModule,MongooseModule.forFeature([{name:'Organization',schema:OrganizationSchema}]),JwtModule.register({
    secret:process.env.jwtsecret,
})],
  controllers: [OrgenizationController],
  providers: [OrgenizationService]
})
export class OrgenizationModule {}
