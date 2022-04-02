import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from './users.model';
import { Post } from './posts.model';

@Table({ tableName: 'likes', timestamps: false })
export class Like extends Model<Like> {

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, primaryKey: true, allowNull: false, onDelete: 'NO ACTION' })
    ownerId: number;

    @ForeignKey(() => Post)
    @Column({ type: DataType.INTEGER, primaryKey: true, allowNull: false, onDelete: 'CASCADE' })
    postId: number;

    @BelongsTo(() => User)
    owner: User;

    @BelongsTo(() => Post)
    post: Post;
}