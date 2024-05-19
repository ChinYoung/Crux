import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm/browser';
import { ColumnType } from '../types/DataSourceTypes';
import { EAccount } from './EAccount';

@Entity()
export class EGroup {
  @Column(ColumnType.varchar)
  name: string;

  @Column(ColumnType.text, { nullable: true })
  desc: string;

  @Column(ColumnType.text)
  backgroundColor: string;

  @Column(ColumnType.varchar)
  tagId: string;

  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany((_type) => EAccount, (item) => item.tags, { cascade: true })
  @JoinTable()
  accountList: EAccount[];
}
