import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FC, createRef, useCallback, useContext, useState } from 'react';
import { RootStackParamList } from '../types/Router';
import {
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  TextInputChangeEventData,
  View,
} from 'react-native';
import { TextInput } from 'react-native';
import { Alert } from 'react-native';
import { EItem } from '../entities/EItem';
import { globalContext } from '../context/globalContext';
import { ETag } from '../entities/ETag';
import 'react-native-get-random-values';
import { nanoid } from 'nanoid';

// TODO: update this

export const CreateItem: FC<NativeStackScreenProps<RootStackParamList, 'AddItem'>> = ({
  navigation,
  route,
}) => {
  const { dbConn } = useContext(globalContext);
  const inputRef = createRef<TextInput>();
  const { tagId } = route.params;

  const [alias, setAlias] = useState<string>('');
  const [newName, setNewName] = useState<string>('');
  const [newContent, setNewContent] = useState<string>('');
  const [newDesc, setDesc] = useState<string>('');

  const updateAlias = useCallback((_e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    setAlias(_e.nativeEvent.text);
  }, []);
  const updateName = useCallback((_e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    setNewName(_e.nativeEvent.text);
  }, []);
  const updateContent = useCallback((_e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    setNewContent(_e.nativeEvent.text);
  }, []);
  const updateDesc = useCallback((_e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    setDesc(_e.nativeEvent.text);
  }, []);

  const addItem = useCallback(async () => {
    if (!dbConn) {
      return;
    }
    if (!newName) {
      Alert.alert('a name is required');
      return;
    }
    dbConn.manager
      .findOne(ETag, {
        where: { tagId },
        relations: { items: true },
      })
      .then((tag) => {
        if (!tag) {
          return;
        }
        const newItem = new EItem();
        newItem.alias = alias;
        newItem.name = newName;
        newItem.content = newContent;
        newItem.desc = newDesc;
        newItem.itemId = nanoid();
        tag.items.push(newItem);
        dbConn.manager
          .save(tag)
          .then((_res) => {
            navigation.goBack();
          })
          .catch((err) => {
            console.log('🚀 ~ file: CreateTag.tsx:48 ~ addTag ~ err:', err);
          });
      });
  }, [alias, dbConn, navigation, newContent, newDesc, newName, tagId]);
  return (
    <View style={styles.container}>
      <View style={styles.inputs}>
        <View>
          <Text style={styles.title}>Alias</Text>
          <TextInput style={styles.nameInput} onChange={updateAlias} ref={inputRef} />
        </View>
        <View>
          <Text style={styles.title}>Name</Text>
          <TextInput style={styles.nameInput} onChange={updateName} ref={inputRef} />
        </View>
        <View>
          <Text style={styles.title}>Content</Text>
          <TextInput style={styles.nameInput} onChange={updateContent} ref={inputRef} />
        </View>
        <View>
          <Text style={styles.title}>Dscription</Text>
          <TextInput style={styles.descInput} multiline={true} onChange={updateDesc} />
        </View>
      </View>
      <Pressable onPress={addItem}>
        <View style={styles.confirmButton}>
          <Text style={styles.confirmText}>confirm</Text>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: 8,
    height: '100%',
  },
  inputs: {
    display: 'flex',
    gap: 16,
  },
  title: {
    color: '#003399',
  },
  nameInput: {
    borderStyle: 'solid',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
  },
  descInput: {
    borderStyle: 'solid',
    borderColor: '#ccc',
    borderWidth: 1,
    minHeight: 64,
    borderRadius: 4,
  },
  confirmButton: {
    backgroundColor: '#333399',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 8,
  },
  confirmText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
