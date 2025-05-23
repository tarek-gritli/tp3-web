import { BaseEntity } from '../../common/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('skills')
export class Skill extends BaseEntity {
  @Column()
  designation: string;
}
