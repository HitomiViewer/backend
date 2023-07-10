import { Exclude } from 'class-transformer';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('user')
export class UserEntity extends BaseEntity {
  @PrimaryColumn()
  id!: string;

  @Column({ nullable: true })
  name!: string;

  @Column({ nullable: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  salt!: string;

  @Column({ nullable: true })
  avatar!: string;

  @Column({ nullable: true })
  @Exclude()
  refreshToken?: string;
}
