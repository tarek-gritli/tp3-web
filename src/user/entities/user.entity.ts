import { Roles } from 'src/auth/enums/auth.enum';
import { BaseEntity } from '../../common/entities/base.entity';
import { Cv } from '../../cv/entities/cv.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: Roles,
    default: Roles.user,
    enumName: 'user_role_enum',
  })
  role: Roles;

  @OneToMany('Cv', 'user')
  cvs: Cv[];
}
