import { Column, Entity } from 'typeorm/browser';
import { ColumnType } from '../types/DataSource';
import { EBase } from './EBase';

@Entity()
export class ETag extends EBase {
  @Column(ColumnType.varchar)
  name: string;
}
