import { Entity, PrimaryGeneratedColumn, OneToOne, OneToMany, Relation, Column } from 'typeorm';
import { User } from './User';
import { Languages } from './Language';
import { Word } from './Word';

@Entity()
export class Libraries {
  @PrimaryGeneratedColumn('uuid')
  libraryId: string;

  @Column({ default: '' })
  language: string;

  @Column({ default: 0 })
  wordCount: number;

  @Column({ default: '' })
  word: string;

  @OneToOne(() => User, (user) => user.libraries)
  user: Relation<User>;

  @OneToMany(() => Languages, (languages) => languages.libraries)
  languages: Relation<Languages>[];

  @OneToMany(() => Word, (words) => words.library)
  words: Relation<Word>[];
}
