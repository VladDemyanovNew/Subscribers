import { BelongsToMany, Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Role } from './roles.model';
import { UserRoles } from './user-roles.model';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, MaxLength } from 'class-validator';
import { Post } from './posts.model';
import { Like } from './likes.model';
import { Subscription } from './subscriptions.model';
import { Comment } from './comments.model';

@Table({ tableName: 'users', timestamps: false })
export class User extends Model<User> {

  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false })
  id: number;

  @IsEmail()
  @IsNotEmpty()
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string;
  
  @IsString()
  @IsNotEmpty()
  @Length(5, 32)
  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @MaxLength(32)
  @IsOptional()
  @Column({ type: DataType.STRING, unique: true, allowNull: true })
  nickname: string;

  @IsOptional()
  @Column({ type: DataType.STRING, allowNull: true })
  refreshToken: string;

  @BelongsToMany(() => Role, () => UserRoles)
  roles: Role[];

  @HasMany(() => Post)
  posts: Post[];

  @HasMany(() => Like, { foreignKey: 'ownerId' })
  likes: Like[];

  @HasMany(() => Subscription, { foreignKey: 'subscriberId' })
  subscriptions: Subscription[];

  @HasMany(() => Comment)
  comments: Comment[];
}