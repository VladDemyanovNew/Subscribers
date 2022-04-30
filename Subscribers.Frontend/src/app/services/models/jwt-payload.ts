
type RoleType = { id: number, name: string };

export interface JwtPayload {
  sub: number;
  email: number;
  iat: number;
  exp: number;
  roles: RoleType[];
  avatarPath?: string;
}
