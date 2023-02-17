import { Module } from '@nestjs/common';
import { OrgenizationService } from './orgenization.service';
import { OrgenizationController } from './orgenization.controller';

@Module({
  controllers: [OrgenizationController],
  providers: [OrgenizationService]
})
export class OrgenizationModule {}
