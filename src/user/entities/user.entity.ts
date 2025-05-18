import { Roles } from 'src/auth/enums/auth.enum';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Cv } from 'src/cv/entities/cv.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: Roles.user, type: 'enum', enum: Roles })
  role: Roles;

  @OneToMany('Cv', 'user')
  cvs: Cv[];
}
