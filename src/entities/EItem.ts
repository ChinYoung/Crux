import {
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToMany,
  OneToMany,
  Column,
} from 'typeorm/browser';
import { EGroup } from './EGroup';
import { EExtendItem } from './EExtendItem';
import { EnuTypes } from '../types/Enum';
import { ColumnType } from '../types/DataSourceTypes';

@Entity()
export class EItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(ColumnType.varchar, { nullable: true })
  itemId: string;

  @Column(ColumnType.varchar, { default: '名称' })
  name: string;

  @Column(ColumnType.text, { nullable: true })
  type: EnuTypes;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany((_type) => EGroup, (tag) => tag.accountList)
  tags: EGroup[];

  @OneToMany(() => EExtendItem, (extendedItem) => extendedItem.item, { cascade: true })
  extendedItems: EExtendItem[];
}
