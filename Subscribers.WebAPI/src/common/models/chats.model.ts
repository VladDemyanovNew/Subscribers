import { BelongsToMany, Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { User } from './users.model';
import { ChatUsers } from './chat-users.model';
import { Message } from './messages.model';

@Table({ tableName: 'chats', timestamps: true })
export class Chat extends Model<Chat> {
  
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  })
  id: number;

  @BelongsToMany(() => User, () => ChatUsers)
  users: User[];

  @HasMany(() => Message)
  messages: Message[];
}