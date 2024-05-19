import { DataSource } from 'typeorm/browser';

export class Db {
  private static instance: Db;
  private connInstance: DataSource;

  static get conn(): DataSource {
    return Db.instance.connInstance;
  }

  private constructor(ds: DataSource) {
    this.connInstance = ds;
  }

  static async init(ds: DataSource) {
    if (Db.instance) {
      return;
    }
    try {
      Db.instance = new Db(ds);
      await Db.conn.initialize();
      // TODO: remember to set dropBeforeSync to false
      const dropBeforeSync = true;
      await Db.conn.synchronize(dropBeforeSync);
    } catch (err) {
      console.log('🚀 ~ Db ~ init ~ err:', err);
    }
  }
}
