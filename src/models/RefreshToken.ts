import { Table, Column, Model, ForeignKey, DataType } from 'sequelize-typescript';
import { User } from './User';

@Table({ tableName: 'refresh_tokens' })
export class RefreshToken extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true
  })
  id!: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  user_id!: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: false
  })
  token!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false
  })
  expires_at!: Date;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false
  })
  revoked!: boolean;
}
