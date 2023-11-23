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
import { EItem } from '../entities/EItem';
import { globalContext } from '../context/globalContext';
import { StyleSheet } from 'react-native';
import { TextInput } from 'react-native';
import { EExtendItem } from '../entities/EExtendItem';

export const ItemDetail: FC<NativeStackScreenProps<RootStackParamList, 'ItemDetail'>> = ({
  navigation,
  route,
}) => {
  const { itemId, alias } = route.params;
  const { dbConn } = useContext(globalContext);
  const [item, setItem] = useState<EItem>();
  const [showAddExtend, setShowAddExtend] = useState<boolean>(false);

  const [extendName, setExtendName] = useState<string>('');
  const [extendValue, setExtendValue] = useState<string>('');

  const refresh = useCallback(() => {
    dbConn?.manager
      .findOne(EItem, {
        where: { itemId },
        relations: { extendedItems: true },
      })
      .then((itemValue) => {
        if (!itemValue) {
          return;
        }
        setItem(itemValue);
      });
  }, [dbConn?.manager, itemId]);

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
    navigation.setOptions({ title: alias });
  }, [alias, navigation]);
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
        <LocalKeyValue keyName="content:" value={item?.content ?? ''} />
        <LocalKeyValue keyName="alias:" value={item?.alias ?? ''} />
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
            <Pressable onPress={confirmToAddExtend} style={styles.addButton}>
              <Text style={styles.addButtonText}>Confirm</Text>
            </Pressable>
            <Pressable onPress={cancelAddExtend} style={styles.addButton}>
              <Text style={styles.addButtonText}>Cancel</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable onPress={showAddExtendedItem} style={styles.addButton}>
            <View>
              <Text style={styles.addButtonText}>Add</Text>
            </View>
          </Pressable>
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
    color: '#000',
    opacity: 0.6,
    paddingLeft: 8,
  },
  keyValueContainer: {
    paddingVertical: 4,
  },
  title: {
    fontSize: 14,
    color: '#000',
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
