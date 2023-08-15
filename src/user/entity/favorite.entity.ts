import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BaseEntity,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from 'src/auth/entities/user.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Favorite extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Exclude()
  id!: string;

  @Column('simple-array')
  favorites!: number[];

  @OneToOne(() => UserEntity)
  @JoinColumn()
  user!: UserEntity;
}
