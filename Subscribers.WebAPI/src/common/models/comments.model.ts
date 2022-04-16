import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { MaxLength } from 'class-validator';
import { User } from './users.model';
import { Post } from './posts.model';

@Table({ tableName: 'comments', timestamps: false })
export class Comment extends Model<Comment> {

    @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false })
    id: number;

    @MaxLength(800, { message: 'Максимальная длина 800' })
    @Column({ type: DataType.STRING })
    message: string;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: false, onDelete: 'NO ACTION' })
    ownerId: number;

    @ForeignKey(() => Post)
    @Column({ type: DataType.INTEGER, allowNull: false, onDelete: 'CASCADE' })
    postId: number;
}