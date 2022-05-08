import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import { User } from './users.model';
import { IsNotEmpty } from 'class-validator';
import { Chat } from './chats.model';

@Table({ tableName: 'messages', timestamps: false })
export class Message extends Model<Message> {

  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  })
  id: number;

  @Column({ type: DataType.STRING })
  content: string;

  @ForeignKey(() => User)
  @IsNotEmpty()
  @Column({ type: DataType.INTEGER, allowNull: false, onDelete: 'NO ACTION' })
  senderId: number;

  @BelongsTo(() => User, { foreignKey: 'senderId' })
  sender: User;

  @ForeignKey(() => Chat)
  @IsNotEmpty()
  @Column({ type: DataType.INTEGER, allowNull: false, onDelete: 'NO ACTION' })
  chatId: number;

  @BelongsTo(() => Chat, { foreignKey: 'chatId' })
  chat: Chat;
}