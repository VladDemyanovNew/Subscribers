import { BelongsToMany, Column, DataType, Model, Table } from 'sequelize-typescript';
import { User } from './users.model';
import { UserRoles } from './user-roles.model';

@Table({ tableName: 'roles', timestamps: false })
export class Role extends Model<Role> {

    @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false })
    id: number;

    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    name: string;

    @BelongsToMany(() => User, () => UserRoles)
    users: User[];
}