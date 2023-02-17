import { Injectable } from '@nestjs/common';
import { CreateOrgenizationDto } from './dto/create-orgenization.dto';
import { UpdateOrgenizationDto } from './dto/update-orgenization.dto';

@Injectable()
export class OrgenizationService {
  create(createOrgenizationDto: CreateOrgenizationDto) {
    
  }

  findAll() {
    return `This action returns all orgenization`;
  }

  findOne(id: number) {
    return `This action returns a #${id} orgenization`;
  }

  update(id: number, updateOrgenizationDto: UpdateOrgenizationDto) {
    return `This action updates a #${id} orgenization`;
  }

  remove(id: number) {
    return `This action removes a #${id} orgenization`;
  }
}
