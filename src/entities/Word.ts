import { Entity, ManyToMany, Relation, Column } from 'typeorm';
import { Languages } from './Language';

@Entity()
export class Word {
  @Column({ default: '' })
  languageId: string;

  @Column({ default: '' })
  word: string;

  @ManyToMany(() => Languages, (language) => language.word)
  language: Relation<Languages>[];
}
