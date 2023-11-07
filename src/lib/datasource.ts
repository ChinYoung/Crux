import { DataSource } from 'typeorm/browser';
import { ETag } from '../entities/ETag';
import { EItem } from '../entities/EItem';
import { EExtendItem } from '../entities/EExtendItem';

export default new DataSource({
  type: 'react-native',
  database: 'Crux',
  location: 'default',
  synchronize: true,
  entities: [ETag, EItem, EExtendItem],
  migrations: ['migrations'],
});
