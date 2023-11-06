import { DataSource } from 'typeorm/browser';

export class Db {
  private static instance: Db;
  private connInstance: DataSource;

  static get conn(): DataSource {
    return Db.instance.connInstance;
  }

  private constructor(entities: Function[]) {
    this.connInstance = new DataSource({
      type: 'react-native',
      database: 'Crux',
      location: 'default',
      synchronize: true,
      entities: entities,
    });
  }

  static async init(entities: Function[]) {
    if (Db.instance) {
      return;
    }
    Db.instance = new Db(entities);
    await Db.conn.initialize();
    await Db.conn.synchronize();
  }
}
