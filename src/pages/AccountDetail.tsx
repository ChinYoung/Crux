import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  FC,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { RootStackParamList } from '../route/Router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { globalContext } from '../context/globalContext';
import { StyleSheet } from 'react-native';
import { EExtendItem } from '../entities/EExtendItem';
import { EAccount } from '../entities/EAccount';
import { PrimaryButton } from '../components/Button';
import { Alert } from 'react-native';
import { createExtendField, FieldEditor } from '../components/FieldEditor';
import { AddFieldButton } from '../components/AddFieldButton';
import { CustomInput } from '../components/CustomInput';
import { EGroup } from '../entities/EGroup';
import { nanoid } from 'nanoid';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { confirmHof } from '../utils/hof';
import { GlobalStyles } from '../global/styles';
import { SafeWithHeaderKeyboardAvoidingView } from '../components/SafeWithHeaderKeyboardAvoidingView';

function createBlankAccount() {
  const defaultAccount = new EAccount();
  defaultAccount.desc = '';
  const { newExtendItem } = createExtendField();
  defaultAccount.extendedItems = [newExtendItem] as EExtendItem[];
  return defaultAccount;
}

type FormProps = { account: EAccount; isEditing?: boolean };

const LocalKeyValue: FC<{ keyName: string; value: string }> = ({ keyName: key, value }) => (
  <View style={styles.keyValueContainer}>
    <View>
      <Text style={styles.title}>{key}</Text>
    </View>
    <View>
      <Text style={styles.content}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between',
    padding: 8,
    gap: 20,
  },
  contentContainer: {
    flex: 1,
    padding: 12,
  },
  keyValueContainer: {
    paddingVertical: 4,
  },
  title: {
    fontSize: 14,
    opacity: 0.6,
  },
  content: {
    fontWeight: 'bold',
  },
  operations: {},
  addExtentdButtonContainer: {
    display: 'flex',
    gap: 4,
  },
  addButton: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0099CC',
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 2,
  },
  addButtonText: {
    color: '#fff',
  },
  addExtendContainer: {
    width: '100%',
    display: 'flex',
    gap: 4,
    marginVertical: 8,
  },
  addExtendName: {
    backgroundColor: '#fff',
    borderRadius: 2,
    padding: 4,
    lineHeight: 16,
  },
  addExtendValue: {
    borderRadius: 2,
    padding: 4,
    backgroundColor: '#fff',
    lineHeight: 16,
  },
});

const AccountForm = forwardRef<any, FormProps>(({ account, isEditing = true }, ref) => {
  const [name, setName] = useState<string>('');
  const [desc, setDesc] = useState<string>('');
  const [extendedItems, setExtendedItems] = useState<EExtendItem[]>([]);
  useImperativeHandle(ref, () => {
    return {
      getValues() {
        return {
          name,
          desc,
          extendedItems,
        };
      },
    };
  });
  const updateLabel = useCallback(
    (itemId: string, label: string) => {
      setExtendedItems(
        extendedItems.map((i) => ({
          ...i,
          name: i.extendItemId === itemId ? label : i.name,
        })),
      );
    },
    [extendedItems],
  );
  const updateField = useCallback(
    (itemId: string, content: string) => {
      setExtendedItems(
        extendedItems.map((i) => ({
          ...i,
          content: i.extendItemId === itemId ? content : i.content,
        })),
      );
    },
    [extendedItems],
  );

  const deleteField = useCallback(
    (id: string) => {
      setExtendedItems(extendedItems.filter((i) => i.extendItemId !== id));
    },
    [extendedItems],
  );

  const addNewField = useCallback(() => {
    const { newExtendItem } = createExtendField();
    setExtendedItems([...extendedItems, newExtendItem] as EExtendItem[]);
  }, [extendedItems]);

  useEffect(() => {
    setExtendedItems(account.extendedItems);
    setName(account.name);
    setDesc(account.desc);
  }, [account.desc, account.extendedItems, account.name]);
  return (
    <ScrollView style={styles.contentContainer}>
      {isEditing ? (
        <View>
          <Text>Name</Text>
          <CustomInput multiple={false} onChange={setName} value={name} />
        </View>
      ) : null}
      {isEditing ? (
        <View>
          <Text>Dscription</Text>
          <CustomInput multiple={true} onChange={setDesc} value={desc} />
        </View>
      ) : (
        <View>
          <Text style={GlobalStyles.description}>{account?.desc}</Text>
        </View>
      )}
      {extendedItems.map((_e) => {
        return isEditing ? (
          <FieldEditor
            key={_e.extendItemId}
            extendItemId={_e.extendItemId}
            name={_e.name}
            content={_e.content}
            updateContent={updateField}
            updateLabel={updateLabel}
            deleteField={deleteField}
          />
        ) : (
          <LocalKeyValue key={_e.extendItemId} keyName={_e.name} value={_e.content} />
        );
      })}
      {isEditing && (
        <View>
          <AddFieldButton onClick={addNewField} />
        </View>
      )}
    </ScrollView>
  );
});

export const AddAccount: FC<NativeStackScreenProps<RootStackParamList, 'AddItem'>> = ({
  navigation,
  route,
}) => {
  const { dbConn } = useContext(globalContext);
  const { groupId, name } = route.params;
  const [item, setItem] = useState<EAccount>();
  const formRef = useRef<{ getValues: () => EAccount }>();

  const createNewAccount = useCallback(() => {
    if (!dbConn) {
      return;
    }
    const values = formRef.current?.getValues();
    if (!values) {
      return;
    }
    if (!values.name) {
      Alert.alert('a name is required');
      return;
    }
    dbConn.manager
      .findOne(EGroup, {
        where: { groupId },
        relations: { accountList: true },
      })
      .then((group) => {
        if (!group) {
          return;
        }
        const newAccount = dbConn.manager.create(EAccount, {
          ...item,
          ...values,
          accountId: nanoid(),
        });
        newAccount.extendedItems = values.extendedItems.map((i) => {
          return dbConn.manager.create(EExtendItem, {
            extendItemId: i.extendItemId,
            name: i.name,
            content: i.content,
          });
        }) as EExtendItem[];
        group.accountList.push(newAccount);
        dbConn.manager
          .save(group)
          .then((_res) => {
            navigation.goBack();
          })
          .catch((err) => {
            console.log('🚀 ~ file: CreateTag.tsx:48 ~ addTag ~ err:', err);
          });
      });
  }, [dbConn, groupId, item, navigation]);

  useEffect(() => {
    setItem(createBlankAccount());
    navigation.setOptions({
      title: `Add an item to group: ${name}`,
    });
  }, [name, navigation]);
  return (
    <View style={styles.container}>
      {item && <AccountForm account={item} ref={formRef} />}
      <PrimaryButton pressHandler={createNewAccount} name="Save" />
    </View>
  );
};

export const AccountDetail: FC<NativeStackScreenProps<RootStackParamList, 'AccountDetail'>> = ({
  navigation,
  route,
}) => {
  const { dbConn } = useContext(globalContext);
  const { accountId, name } = route.params;
  const [item, setItem] = useState<EAccount>();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const formRef = useRef<{ getValues: () => EAccount }>();

  const startEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  const getAccountDetail = useCallback(
    async (id: string) => {
      const res = await dbConn?.manager.findOne(EAccount, {
        where: { accountId: id },
        relations: { extendedItems: true },
      });
      return res;
    },
    [dbConn?.manager],
  );

  const refresh = useCallback(async () => {
    if (!accountId) {
      return;
    }
    const account = await getAccountDetail(accountId);
    if (!account) {
      return;
    }
    setItem(account);
  }, [accountId, getAccountDetail]);

  const updateAccount = useCallback(() => {
    const values = formRef.current?.getValues();
    if (!dbConn?.manager) {
      return;
    }
    if (!values) {
      return;
    }
    const newAccount = dbConn.manager.create(EAccount, {
      ...item,
      ...values,
    });
    newAccount.extendedItems = values.extendedItems.map((i) => {
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

    dbConn.manager
      .save<EAccount>(newAccount)
      .then(() => {
        refresh();
        setIsEditing(false);
      })
      .catch((err) => {
        console.log('🚀 ~ dbConn.manager.save ~ err:', err);
      });
  }, [dbConn, item, refresh]);

  const deleteAccount = useCallback(async () => {
    const targetAccount = await dbConn?.manager.findOne(EAccount, {
      where: { accountId },
      relations: { extendedItems: true },
    });
    if (!targetAccount) {
      return;
    }
    await dbConn?.manager.remove(targetAccount);
    navigation.goBack();
  }, [accountId, dbConn?.manager, navigation]);

  useEffect(() => {
    navigation.setOptions({
      title: name,
      headerRight: () => (
        <Pressable onPress={confirmHof(deleteAccount)}>
          <FontAwesomeIcon color="red" icon={faTrash} />
        </Pressable>
      ),
    });
  }, [deleteAccount, name, navigation]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <SafeWithHeaderKeyboardAvoidingView>
      <View style={[styles.container, GlobalStyles.debug]}>
        {item && <AccountForm account={item} isEditing={isEditing} ref={formRef} />}
        {/* buttons on the bottom */}
        <View style={styles.operations}>
          <View style={styles.addExtentdButtonContainer}>
            {isEditing && <PrimaryButton pressHandler={updateAccount} name="Save" />}
            {!isEditing && <PrimaryButton pressHandler={startEdit} name="Edit" />}
          </View>
        </View>
      </View>
    </SafeWithHeaderKeyboardAvoidingView>
  );
};
