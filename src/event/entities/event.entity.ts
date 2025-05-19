import { Cv } from 'src/cv/entities/cv.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EventType } from '../event.enum';

@Entity('event')
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: EventType })
  type: EventType;

  @ManyToOne(() => Cv, { eager: true })
  cv: Cv;

  @ManyToOne(() => User, { eager: true })
  user: User;

  @Column({ nullable: true, type: 'json' })
  details: any;

  @CreateDateColumn()
  createdAt: Date;
}
