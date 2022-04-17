import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from './users.model';

@Table({ tableName: 'subscriptions', timestamps: false })
export class Subscription extends Model<Subscription> {

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, primaryKey: true, allowNull: false, onDelete: 'CASCADE' })
  ownerId: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, primaryKey: true, allowNull: false, onDelete: 'NO ACTION' })
  subscriberId: number;

  @BelongsTo(() => User, { foreignKey: 'ownerId' })
  owner: User;

  @BelongsTo(() => User, { foreignKey: 'subscriberId' })
  subscriber: User;
}