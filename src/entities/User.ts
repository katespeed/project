import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
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
import { Friend } from './Friends';
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

  @ManyToMany(() => Languages, (languages) => languages.user)
  @JoinTable()
  language: Relation<Languages>[];

  @ManyToOne(() => Game, (game) => game.user)
  game: Relation<Game>;

  @OneToMany(() => Friend, (friend) => friend.user)
  friend: Relation<Friend>[];

  @OneToOne(() => Libraries, (libraries) => libraries.user)
  @JoinColumn()
  libraries: Relation<Libraries>;
}
