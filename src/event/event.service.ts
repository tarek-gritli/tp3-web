import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { Repository } from 'typeorm';
import { EventType } from './event.enum';
import { Subject } from 'rxjs';
import { Roles } from 'src/auth/enums/auth.enum';

@Injectable()
export class EventService {
  private events = new Subject<any>();

  constructor(
    @InjectRepository(Event) private readonly eventRepo: Repository<Event>,
  ) {}

  @OnEvent(EventType.ADD)
  @OnEvent(EventType.UPDATE)
  @OnEvent(EventType.DELETE)
  async createEvent(createEventDto: CreateEventDto) {
    const event = this.eventRepo.create(createEventDto);

    const savedEvent = await this.eventRepo.save(event);

    this.events.next({
      ...savedEvent,
      cvId: createEventDto.cvId,
      userId: createEventDto.userId,
    });

    return savedEvent;
  }

  getEvents(userId: number, role: Roles) {
    const queryBuilder = this.eventRepo
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.cv', 'cv')
      .leftJoinAndSelect('event.user', 'user')
      .leftJoinAndSelect('cv.user', 'cvUser');

    if (role !== Roles.admin) {
      queryBuilder.where('cvUser.id = :userId', { userId });
    }

    return queryBuilder.orderBy('event.createdAt', 'DESC').getMany();
  }

  subscribeToEvents() {
    return this.events.asObservable();
  }
}
