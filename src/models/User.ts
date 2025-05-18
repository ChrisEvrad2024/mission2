import { Table, Column, Model, ForeignKey, BelongsTo, DataType } from 'sequelize-typescript';
import { Role } from './Role';

@Table({ tableName: 'users' })
export class User extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true
  })
  id!: number;

  @Column({
    type: DataType.STRING(255),
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true
    }
  })
  email!: string;

  @Column({
    type: DataType.CHAR(60),
    allowNull: false
  })
  password_hash!: string;

  @ForeignKey(() => Role)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  role_id!: number;

  @BelongsTo(() => Role)
  role!: Role;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true
  })
  is_active!: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true
  })
  last_login!: Date | null;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0
  })
  failed_attempts!: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false
  })
  mfa_enabled!: boolean;
}
