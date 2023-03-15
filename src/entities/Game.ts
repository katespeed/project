import { Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne, Relation, Column } from 'typeorm';
import { User } from './User';
import { Languages } from './Language';

@Entity()
export class Game {
  @PrimaryGeneratedColumn('uuid')
  gameId: string;

  @Column({ default: '' })
  languageId: string;

  @Column({ default: 100 }) // decrement
  timer: number;

  @Column({ default: 0 })
  yourMistakes: number;

  @Column({ default: 0 })
  enemyMistakes: number;

  @Column({ default: 0 })
  wordUsed: number;

  @Column({ default: false })
  alreadyUsed: boolean;

  @Column({ default: 0 })
  wordCount: number;

  @Column({ default: false })
  result: boolean; // win or lose

  @Column({ default: '' })
  word: string;

  @OneToMany(() => User, (user) => user.language)
  user: Relation<User>[];

  @ManyToOne(() => Languages, (language) => language.game)
  language: Relation<User>[];
}
