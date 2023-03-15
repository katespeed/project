import { Entity, PrimaryGeneratedColumn, ManyToOne, Relation, Column } from 'typeorm';
import { User } from './User';

@Entity()
export class Friend {
  @PrimaryGeneratedColumn('uuid')
  friendId: string;

  @Column({ default: '' })
  friendName: string;

  @ManyToOne(() => User, (user) => user.friend)
  user: Relation<User>;
}
