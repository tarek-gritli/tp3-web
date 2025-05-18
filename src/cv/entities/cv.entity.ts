import { BaseEntity } from '../../common/entities/base.entity';
import { Skill } from '../../skill/entities/skill.entity';
import { User } from '../../user/entities/user.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

@Entity('cvs')
export class Cv extends BaseEntity {
  @Column()
  name: string;

  @Column()
  firstname: string;

  @Column()
  age: number;

  @Column()
  cin: string;

  @Column()
  job: string;

  @ManyToOne('User', 'cvs', { onDelete: 'CASCADE' })
  user: User;

  @ManyToMany(() => Skill)
  @JoinTable({
    name: 'cv_skill',
    joinColumn: {
      name: 'cv_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'skill_id',
      referencedColumnName: 'id',
    },
  })
  skills: Skill[];
}
