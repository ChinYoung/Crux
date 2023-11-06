import { FC, PropsWithChildren, createContext, useCallback, useEffect, useState } from 'react';
import { DataSource } from 'typeorm/browser';
import * as allEntities from '../entities';
import { Db } from '../lib/Db';

type TGlobalContext = {
  dbConn: DataSource | null;
  isLoading: boolean;
  loading: () => void;
};
export const globalContext = createContext<TGlobalContext>({
  dbConn: null,
  isLoading: false,
  loading: () => {},
});

export const GlobalContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [dbConn, setDbConn] = useState<DataSource | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loading = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 10000);
  }, []);

  useEffect(() => {
    Db.init(Object.values(allEntities)).then(() => {
      setDbConn(Db.conn);
    });
  }, []);

  return (
    <globalContext.Provider value={{ dbConn, isLoading, loading }}>
      {children}
    </globalContext.Provider>
  );
};
