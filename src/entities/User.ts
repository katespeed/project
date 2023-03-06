import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
}
