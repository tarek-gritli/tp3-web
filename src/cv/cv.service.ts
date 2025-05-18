import { Injectable } from '@nestjs/common';
import { Cv } from './entities/cv.entity';
import { BaseService } from 'src/common/services/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CvService extends BaseService<Cv> {
  constructor(@InjectRepository(Cv) private readonly cvRepo: Repository<Cv>) {
    super(cvRepo);
  }

  findAllByUserId(userId: number) {
    return this.cvRepo.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }
}
