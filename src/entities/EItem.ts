import { Column, Entity } from 'typeorm/browser';
import { ColumnType } from '../types/DataSource';
import { EBase } from './EBase';

@Entity()
export class EItem extends EBase {
  @Column(ColumnType.varchar, { default: '名称' })
  name: string;

  @Column(ColumnType.varchar, { nullable: true })
  nameAlias: string | null;

  @Column(ColumnType.text)
  desc: string;

  @Column(ColumnType.text)
  content: string;
}
