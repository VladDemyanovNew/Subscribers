import { Role } from '../models/roles.model';

export type JwtPayload = {
  email: string;
  sub: number;
  roles: Role[];
};