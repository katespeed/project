import { Entity, PrimaryColumn, ManyToOne, Relation, Column } from 'typeorm';
import { User } from './User';

@Entity()
export class Friends {
  @PrimaryColumn()
  friendId: string;

  @Column({ default: '' })
  friendName: string;

  @ManyToOne(() => User, (user) => user.friends)
  user: Relation<User>;
}
