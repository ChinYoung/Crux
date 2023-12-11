import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm/browser';
import { ColumnType } from '../types/DataSourceTypes';
import { EGroup } from './EGroup';
import { EExtendItem } from './EExtendItem';

@Entity()
export class EAccount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(ColumnType.varchar, { nullable: true })
  accountId: string;

  @Column(ColumnType.varchar, { default: '名称' })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany((_type) => EGroup, (tag) => tag.accountList)
  tags: EGroup[];

  @OneToMany(() => EExtendItem, (extendedItem) => extendedItem.item, { cascade: true })
  extendedItems: EExtendItem[];

  @Column(ColumnType.varchar)
  account: string;

  @Column(ColumnType.text)
  password: string;

  @Column(ColumnType.text)
  desc: string;
}
