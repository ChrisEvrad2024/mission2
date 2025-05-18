import { Table, Column, Model, HasMany, DataType } from 'sequelize-typescript';
import { User } from './User';

@Table({ tableName: 'roles' })
export class Role extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true
  })
  id!: number;

  @Column({
    type: DataType.STRING(50),
    unique: true,
    allowNull: false
  })
  name!: string;

  @Column({
    type: DataType.JSON,
    allowNull: false
  })
  permissions!: object;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false
  })
  is_default!: boolean;

  @HasMany(() => User)
  users!: User[];
}
