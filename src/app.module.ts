import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { DepartmentModule } from './department/department.module';
import { GoalModule } from './goal/goal.module';
import { OrgenizationModule } from './orgenization/orgenization.module';
import { ProjectModule } from './project/project.module';
import { TaskModule } from './task/task.module';
import { TeamModule } from './team/team.module';
import { AdminModule } from './admin/admin.module';
import { MemberModule } from './members/member.module';

@Module({
  imports: [UserModule,MemberModule,AdminModule,ConfigModule.forRoot({isGlobal:true}),MongooseModule.forRoot(process.env.url),AuthModule, DepartmentModule, GoalModule, OrgenizationModule, ProjectModule, TaskModule, TeamModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
