import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import { IsNotEmpty, MaxLength } from 'class-validator';
import { User } from './users.model';
import { Like } from './likes.model';
import { Comment } from './comments.model';

@Table({ tableName: 'posts', timestamps: false })
export class Post extends Model<Post> {

  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false })
  id: number;

  @MaxLength(4000, { message: 'Максимальная длина 4000' })
  @Column({ type: DataType.STRING })
  content: string;

  @MaxLength(32, { message: 'Максимальная длина 32' })
  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @Column({ type: DataType.STRING })
  imagePath: string;

  @ForeignKey(() => User)
  @IsNotEmpty()
  @Column({ type: DataType.INTEGER, allowNull: false })
  ownerId: number;

  @BelongsTo(() => User)
  owner: Post;

  @HasMany(() => Like)
  likes: Like[];

  @HasMany(() => Comment)
  comments: Comment[];
}