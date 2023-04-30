import { Entity, ManyToMany, ManyToOne, Relation, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Languages } from './Language';
import { Libraries } from './Libraries';

@Entity()
export class Word {
  @PrimaryGeneratedColumn('uuid')
  worId: string;

  @Column({ default: '' })
  languageId: string;

  @Column({ default: '' })
  word: string;

  @ManyToMany(() => Languages, (language) => language.word)
  language: Relation<Languages>[];

  @ManyToOne(() => Libraries, (library) => library.words)
  library: Relation<Libraries>;
}
