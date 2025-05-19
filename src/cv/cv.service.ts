import { Injectable } from '@nestjs/common';
import { Cv } from './entities/cv.entity';
import { BaseService } from 'src/common/services/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateCvDto } from './dto/create-cv.dto';
import { EventType } from 'src/event/event.enum';
import { UpdateCvDto } from './dto/update-cv.dto';
import { Roles } from 'src/auth/enums/auth.enum';

@Injectable()
export class CvService extends BaseService<Cv> {
  constructor(
    @InjectRepository(Cv) private readonly cvRepo: Repository<Cv>,
    private readonly eventEmitter: EventEmitter2,
  ) {
    super(cvRepo);
  }

  async createCv(createCvDto: CreateCvDto, userId: number) {
    const cv = await this.create({ ...createCvDto, user: { id: userId } });
    const payload = {
      type: EventType.ADD,
      cvId: cv.id,
      userId,
    };
    console.log('Emitting event:', payload);
    this.eventEmitter.emit(EventType.ADD, payload);

    return cv;
  }

  async updateCv(cvId: number, updateCvDto: UpdateCvDto, userId: number) {
    const oldCv = await this.findOne(cvId);

    const cv = await this.update(cvId, updateCvDto);

    const details = {};
    for (const key in updateCvDto) {
      if (oldCv[key] != updateCvDto[key]) {
        details[key] = {
          oldValue: oldCv[key],
          newValue: updateCvDto[key],
        };
      }
    }

    const payload = {
      type: EventType.UPDATE,
      cvId,
      userId,
      details,
    };

    console.log('Emitting event:', payload);
    this.eventEmitter.emit(EventType.UPDATE, payload);
    return cv;
  }
  async deleteCv(cvId: number, userId: number) {
    await this.delete(cvId);
    const payload = {
      type: EventType.DELETE,
      cvId,
      userId,
    };
    this.eventEmitter.emit(EventType.DELETE, payload);
    return { success: true, message: 'CV deleted successfully' };
  }

  findAllCvs(userId: number, role: Roles) {
    const queryBuilder = this.cvRepo
      .createQueryBuilder('cv')
      .leftJoinAndSelect('cv.user', 'user');
    if (role !== Roles.admin) {
      queryBuilder.where('user.id = :userId', { userId });
    }
    return queryBuilder.getMany();
  }
}
