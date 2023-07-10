import { UserEntity } from 'src/auth/entities/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum LogType {
  READ = 'read',
  LOGIN = 'login',
}

@Entity('log')
export class LogEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: number;

  @Column('varchar', { name: 'ip', length: 255 })
  ip!: string;

  @Column('enum', {
    name: 'type',
    enum: LogType,
  })
  type!: LogType;

  @Column('int', { name: 'id_hitomi', nullable: true, unsigned: true })
  idHitomi?: number;

  @ManyToOne(() => UserEntity)
  user!: UserEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
