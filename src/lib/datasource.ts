import { DataSource } from 'typeorm/browser';
import { EGroup } from '../entities/EGroup';
import { EItem } from '../entities/EItem';
import { EExtendItem } from '../entities/EExtendItem';
import { EAccount } from '../entities/EAccount';

export default new DataSource({
  type: 'react-native',
  database: 'Crux',
  location: 'default',
  synchronize: true,
  // TODO: remember to set dropSchema to false
  dropSchema: true,
  entities: [EGroup, EItem, EExtendItem, EAccount],
  migrations: ['migrations'],
});
