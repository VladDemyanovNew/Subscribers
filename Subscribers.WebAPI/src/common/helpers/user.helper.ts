import { UserDto } from '../dtos/user.dto';
import { User } from '../models/users.model';

export function parseUserToDto(user: User): UserDto {
  return <UserDto> {
    id: user.id,
    email: user.email,
    nickname: user.nickname,
    avatarPath: user.avatarPath,
  };
}