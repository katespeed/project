import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinTable,
  JoinColumn,
  Relation,
  Column,
} from 'typeorm';
import { Languages } from './Language';
import { Game } from './Game';
import { Friends } from './Friends';
import { Libraries } from './Libraries';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column({ unique: true })
  userName: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: '' })
  dictionaryId: string;

  @Column({ default: '' })
  friendListId: string;

  @Column({ default: 0 })
  numOfFriends: number;

  @Column({ unique: true })
  passwordHash: string;

  @Column({ default: false })
  isAdmin: boolean;

  @ManyToOne(() => Languages, (languages) => languages.user)
  @JoinTable()
  language: Relation<Languages>[];

  @ManyToOne(() => Game, (game) => game.user)
  game: Relation<Game>;

  @OneToMany(() => Friends, (friends) => friends.user)
  friends: Relation<Friends>[];

  @OneToOne(() => Libraries, (libraries) => libraries.user)
  @JoinColumn()
  libraries: Relation<Libraries>;
}
