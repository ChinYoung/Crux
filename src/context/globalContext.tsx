import { FC, PropsWithChildren, createContext, useCallback, useEffect, useState } from 'react';
import { DataSource } from 'typeorm/browser';

import { Db } from '../lib/Db';
import datasource from '../lib/datasource';
import { ClickOutsideProvider } from 'react-native-click-outside';
import { PortalProvider } from '@gorhom/portal';

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
    Db.init(datasource).then(() => {
      setDbConn(Db.conn);
    });
  }, []);

  return (
    <globalContext.Provider value={{ dbConn, isLoading, loading }}>
      <PortalProvider>
        <ClickOutsideProvider>{children}</ClickOutsideProvider>
      </PortalProvider>
    </globalContext.Provider>
  );
};
