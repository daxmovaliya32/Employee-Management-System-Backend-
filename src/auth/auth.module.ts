import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport/dist';
import { authController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt/dist';
import { MongooseModule } from '@nestjs/mongoose';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryModule } from 'src/helper/cloudinary/cloudinary.module';
import { MemberSchema } from 'src/models/Member.interface';
// import { MailerModule } from '@nestjs-modules/mailer/dist/mailer.module';
// import { SendgridService } from 'src/auth/sendmail.helper';

@Module({
  imports:[CloudinaryModule,ConfigModule.forRoot({isGlobal:true}),NestjsFormDataModule,JwtModule.register({
       secret:process.env.jwtsecret,
  }) ,PassportModule,MongooseModule.forFeature([{name:'Member',schema:MemberSchema}])],
  providers: [AuthService],
  controllers:[authController]
})
export class AuthModule {}
