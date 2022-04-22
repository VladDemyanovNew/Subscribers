import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Role } from './roles.model';
import { User } from './users.model';
import { IsNotEmpty } from 'class-validator';

@Table({ tableName: 'user_roles', timestamps: false })
export class UserRoles extends Model<UserRoles> {

  @ForeignKey(() => User)
  @IsNotEmpty()
  @Column({ type: DataType.INTEGER, primaryKey: true, allowNull: false })
  userId: number;

  @ForeignKey(() => Role)
  @IsNotEmpty()
  @Column({ type: DataType.INTEGER, primaryKey: true, allowNull: false })
  roleId: number;
}