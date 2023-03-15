import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  OneToMany,
  ManyToOne,
  Relation,
  JoinTable,
  Column,
} from 'typeorm';
import { User } from './User';
import { Game } from './Game';
import { Libraries } from './Libraries';
import { Word } from './Word';

@Entity()
export class Languages {
  @PrimaryGeneratedColumn('uuid')
  languageId: string;

  @Column({ default: '' })
  language: string;

  @Column({ default: 0 })
  wordCount: number;

  @ManyToMany(() => User, (user) => user.language)
  user: Relation<User>[];

  @OneToMany(() => Game, (game) => game.user)
  game: Relation<Game>[];

  @ManyToOne(() => Libraries, (libraries) => libraries.language)
  libraries: Relation<Libraries>;

  @ManyToMany(() => Word, (word) => word.language)
  @JoinTable()
  word: Relation<Word>[];
}
