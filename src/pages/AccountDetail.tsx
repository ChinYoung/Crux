import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FC, useCallback, useContext, useEffect, useState } from 'react';
import { RootStackParamList } from '../route/Router';
import {
  NativeSyntheticEvent,
  Pressable,
  Text,
  TextInputChangeEventData,
  View,
} from 'react-native';
import { globalContext } from '../context/globalContext';
import { StyleSheet } from 'react-native';
import { TextInput } from 'react-native';
import { EExtendItem } from '../entities/EExtendItem';
import { EAccount } from '../entities/EAccount';
import { NegtiveButton, PrimaryButton } from '../components/Button';

export const AccountDetail: FC<NativeStackScreenProps<RootStackParamList, 'AccountDetail'>> = ({
  navigation,
  route,
}) => {
  const { accountId, name } = route.params;
  const { dbConn } = useContext(globalContext);
  const [item, setItem] = useState<EAccount>();
  const [showAddExtend, setShowAddExtend] = useState<boolean>(false);

  const [extendName, setExtendName] = useState<string>('');
  const [extendValue, setExtendValue] = useState<string>('');

  const refresh = useCallback(() => {
    dbConn?.manager
      .findOne(EAccount, {
        where: { accountId },
        relations: { extendedItems: true },
      })
      .then((itemValue) => {
        if (!itemValue) {
          return;
        }
        setItem(itemValue);
      });
  }, [accountId, dbConn?.manager]);

  const showAddExtendedItem = useCallback(() => {
    setShowAddExtend(true);
  }, []);

  const cancelAddExtend = useCallback(() => {
    setShowAddExtend(false);
  }, []);

  const confirmToAddExtend = useCallback(() => {
    if (!dbConn?.manager) {
      return;
    }
    if (!item) {
      return;
    }
    const extendItem = dbConn.manager.create(EExtendItem, {
      name: extendName,
      content: extendValue,
    });

    item.extendedItems.push(extendItem);
    dbConn.manager.save(item).then(() => {
      setExtendName('');
      setExtendValue('');
      refresh();
      setShowAddExtend(false);
    });
  }, [dbConn, extendName, extendValue, item, refresh]);

  const updateExtendName = useCallback((_e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    setExtendName(_e.nativeEvent.text);
  }, []);
  const updateExtengValue = useCallback((_e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    setExtendValue(_e.nativeEvent.text);
  }, []);

  useEffect(() => {
    navigation.setOptions({ title: name });
  }, [name, navigation]);
  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <View style={styles.container}>
      {/* info on the top */}
      <View style={styles.contentContainer}>
        <View style={styles.descContainer}>
          {/* <Text>description:</Text> */}
          <Text style={styles.description}>{item?.desc}</Text>
        </View>
        <LocalKeyValue keyName="content:" value={item?.password ?? ''} />
        <LocalKeyValue keyName="name:" value={item?.name ?? ''} />
        {item?.extendedItems.map((_e) => (
          <LocalKeyValue keyName={_e.name} value={_e.content} key={_e.id} />
        ))}
        {showAddExtend ? (
          <View style={styles.addExtendContainer}>
            <TextInput style={styles.addExtendName} onChange={updateExtendName} />
            <TextInput style={styles.addExtendValue} onChange={updateExtengValue} />
          </View>
        ) : null}
        {showAddExtend ? (
          <View style={styles.addExtentdButtonContainer}>
            <NegtiveButton pressHandler={cancelAddExtend} name="Cancel" />
            <PrimaryButton pressHandler={confirmToAddExtend} name="Confirm" />
          </View>
        ) : (
          <PrimaryButton pressHandler={showAddExtendedItem} name="Add" />
        )}
      </View>
      {/* buttons on the bottom */}
      <View style={styles.operations}>
        <View style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Text>Favirite</Text>
        </View>
        <View style={{ width: 2 }}>
          <Text>·</Text>
        </View>
      </View>
    </View>
  );
};

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
  },
  contentContainer: {
    padding: 12,
  },
  descContainer: {
    paddingBottom: 16,
  },
  description: {
    fontSize: 12,
    opacity: 0.6,
    paddingLeft: 8,
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
  operations: {
    padding: 24,
    display: 'flex',
    flexDirection: 'row',
  },
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
    flexDirection: 'row',
    gap: 4,
    marginVertical: 8,
  },
  addExtendName: {
    backgroundColor: '#fff',
    borderRadius: 2,
    padding: 2,
    flex: 1,
  },
  addExtendValue: {
    borderRadius: 2,
    padding: 2,
    backgroundColor: '#fff',
    flex: 3,
  },
});
