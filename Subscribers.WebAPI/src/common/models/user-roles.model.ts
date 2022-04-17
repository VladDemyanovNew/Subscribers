import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Role } from './roles.model';
import { User } from './users.model';

@Table({ tableName: 'user_roles', timestamps: false })
export class UserRoles extends Model<UserRoles> {

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, primaryKey: true, allowNull: false })
  userId: number;

  @ForeignKey(() => Role)
  @Column({ type: DataType.INTEGER, primaryKey: true, allowNull: false })
  roleId: number;
}