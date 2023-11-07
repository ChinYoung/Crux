import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm/browser';
import { ColumnType } from '../types/DataSource';
import { EItem } from './EItem';

@Entity()
export class EExtendItem {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column(ColumnType.varchar, { default: '名称' })
  name: string;

  @Column(ColumnType.text)
  content: string;

  @ManyToOne(() => EItem, (item) => item.extendedItems)
  item: EItem;
}
