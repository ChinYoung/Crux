import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm/browser';
import { ColumnType } from '../types/DataSource';
import { EItem } from './EItem';

@Entity()
export class EGroup {
  @Column(ColumnType.varchar)
  name: string;

  @Column(ColumnType.text, { nullable: true })
  desc: string;

  @Column(ColumnType.varchar)
  tagId: string;

  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany((_type) => EItem, (item) => item.tags, { cascade: true })
  @JoinTable()
  items: EItem[];
}
