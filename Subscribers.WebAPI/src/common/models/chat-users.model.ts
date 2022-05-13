import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from './users.model';
import { IsNotEmpty } from 'class-validator';
import { Chat } from './chats.model';

@Table({ tableName: 'chat_users', timestamps: false })
export class ChatUsers extends Model<ChatUsers> {

  @ForeignKey(() => User)
  @IsNotEmpty()
  @Column({ type: DataType.INTEGER, primaryKey: true, allowNull: false })
  userId: number;

  @ForeignKey(() => Chat)
  @IsNotEmpty()
  @Column({ type: DataType.INTEGER, primaryKey: true, allowNull: false, onDelete: 'CASCADE' })
  chatId: number;
}