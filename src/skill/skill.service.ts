import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/services/base.service';
import { Skill } from './entities/skill.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SkillService extends BaseService<Skill> {
  constructor(
    @InjectRepository(Skill) private readonly skillRepo: Repository<Skill>,
  ) {
    super(skillRepo);
  }
}
