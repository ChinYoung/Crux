import { useCallback, useContext, useEffect, useState } from 'react';
import { EAccount } from '../entities/EAccount';
import { globalContext } from '../context/globalContext';
import { EExtendItem } from '../entities/EExtendItem';
import { Alert } from 'react-native';
import { EGroup } from '../entities/EGroup';
import { nanoid } from 'nanoid';

export const useAccountCurd = (accountId?: EAccount['accountId']) => {
  const [localAccountId, setLocalAccountId] = useState<EAccount['accountId']>();

  const [account, setAccount] = useState<EAccount>();

  const { dbConn } = useContext(globalContext);
  const refresh = useCallback(async () => {
    if (!localAccountId) {
      return;
    }
    const res = await dbConn?.manager.findOne(EAccount, {
      where: { accountId: localAccountId },
      relations: { extendedItems: true },
    });
    if (!res) {
      return;
    }
    setAccount(res);
  }, [localAccountId, dbConn?.manager]);

  const updateAccount = useCallback(
    (updatedValue: EAccount) => {
      if (!localAccountId) {
        return;
      }
      if (!dbConn?.manager) {
        return;
      }
      if (!updatedValue) {
        return;
      }
      const newAccount = dbConn.manager.create(EAccount, {
        ...updatedValue,
        accountId: localAccountId,
        id: account?.id,
      });
      newAccount.extendedItems = updatedValue.extendedItems.map((i) => {
        if (i.id) {
          const extendedItem = dbConn.manager.create(EExtendItem, i);
          return extendedItem;
        }
        return dbConn.manager.create(EExtendItem, {
          extendItemId: i.extendItemId,
          name: i.name,
          content: i.content,
        });
      }) as EExtendItem[];
      return dbConn.manager.save<EAccount>(newAccount);
    },
    [account?.id, dbConn?.manager, localAccountId],
  );

  const deleteAccount = useCallback(async () => {
    if (!localAccountId) {
      return;
    }
    const targetAccount = await dbConn?.manager.findOne(EAccount, {
      where: { accountId: localAccountId },
      relations: { extendedItems: true },
    });
    if (!targetAccount) {
      return;
    }
    await dbConn?.manager.remove(targetAccount);
  }, [localAccountId, dbConn?.manager]);

  const createNewAccount = useCallback(
    async (groupId: EGroup['groupId'], newAccountData: EAccount) => {
      if (!dbConn) {
        return;
      }
      if (!newAccountData) {
        return;
      }
      if (!newAccountData.name) {
        Alert.alert('a name is required');
        return;
      }
      const group = await dbConn.manager.findOne(EGroup, {
        where: { groupId },
        relations: { accountList: true },
      });
      if (!group) {
        return;
      }
      const newAccount = dbConn.manager.create(EAccount, {
        ...newAccountData,
        accountId: nanoid(),
      });
      newAccount.extendedItems = newAccountData.extendedItems.map((i) => {
        return dbConn.manager.create(EExtendItem, {
          extendItemId: i.extendItemId,
          name: i.name,
          content: i.content,
        });
      }) as EExtendItem[];
      group.accountList.push(newAccount);
      return dbConn.manager.save(group);
    },
    [dbConn],
  );

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    setLocalAccountId(accountId);
  }, [accountId]);

  return {
    account,
    setAccount,
    setLocalAccountId,
    refresh,
    updateAccount,
    deleteAccount,
    createNewAccount,
  };
};
