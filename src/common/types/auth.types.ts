import { Request } from 'express';
import { Roles } from 'src/auth/enums/auth.enum';

export interface RequestWithUser extends Request {
  user: {
    userId: number;
    username: string;
    role: Roles;
  };
}
