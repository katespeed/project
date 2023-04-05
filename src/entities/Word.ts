import { Entity, ManyToMany, Relation, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Languages } from './Language';

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
}
