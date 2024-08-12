import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm/browser';
import { ColumnType } from '../types/DataSourceTypes';
import { EAccount } from './EAccount';

@Entity()
export class EExtendItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(ColumnType.varchar)
  extendItemId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column(ColumnType.varchar, { default: '名称' })
  name: string;

  @Column(ColumnType.text)
  content: string;

  @ManyToOne(() => EAccount, (item) => item.extendedItems, {
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false,
  })
  item: EAccount;
}
