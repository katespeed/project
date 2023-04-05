import { Entity, PrimaryColumn, ManyToOne, Relation, Column } from 'typeorm';
import { User } from './User';

@Entity()
export class Friend {
  @PrimaryColumn()
  friendId: string;

  @Column({ default: '' })
  friendName: string;

  @ManyToOne(() => User, (user) => user.friend)
  user: Relation<User>;
}
