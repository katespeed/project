import { Entity, PrimaryGeneratedColumn, OneToOne, OneToMany, Relation, Column } from 'typeorm';
import { User } from './User';
import { Languages } from './Language';

@Entity()
export class Libraries {
  @PrimaryGeneratedColumn('uuid')
  LibraryId: string;

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
}
