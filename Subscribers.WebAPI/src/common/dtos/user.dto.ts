export class UserDto {
  readonly id: number;
  readonly email: string;
  readonly nickname?: string;
  readonly avatarPath?: string;
}