import { PartialType } from '@nestjs/mapped-types';
import { CreateOrgenizationDto } from './create-orgenization.dto';

export class UpdateOrgenizationDto extends PartialType(CreateOrgenizationDto) {}
