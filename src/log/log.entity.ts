import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('log')
export class LogEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: number;

  @Column('varchar', { name: 'ip', nullable: true, length: 255 })
  ip?: string;

  @Column('int', { name: 'id_hitomi', nullable: true, unsigned: true })
  idHitomi?: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
