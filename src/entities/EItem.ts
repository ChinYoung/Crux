import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToMany,
  OneToMany,
} from 'typeorm/browser';
import { ColumnType } from '../types/DataSource';
import { EGroup } from './EGroup';
import { EExtendItem } from './EExtendItem';

@Entity()
export class EItem {
  @Column(ColumnType.varchar)
  itemId: string;

  @Column(ColumnType.varchar, { default: '名称' })
  name: string;

  @Column(ColumnType.varchar)
  alias: string;

  @Column(ColumnType.text)
  desc: string;

  @Column(ColumnType.text)
  content: string;

  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany((_type) => EGroup, (tag) => tag.items)
  tags: EGroup[];

  @OneToMany(() => EExtendItem, (extendedItem) => extendedItem.item, { cascade: true })
  extendedItems: EExtendItem[];
}
