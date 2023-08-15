import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BaseEntity,
  OneToOne,
} from 'typeorm';
import { UserEntity } from 'src/auth/entities/user.entity';

@Entity()
export class Favorite extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('simple-array')
  favorites!: number[];

  @OneToOne(() => UserEntity)
  user!: UserEntity;
}
