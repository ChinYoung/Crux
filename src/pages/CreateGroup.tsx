import { FC, createRef, useCallback, useContext, useState } from 'react';
import {
  Alert,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputChangeEventData,
  View,
} from 'react-native';
import { globalContext } from '../context/globalContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../route/Router';
import 'react-native-get-random-values';
import { nanoid } from 'nanoid';
import { EGroup } from '../entities/EGroup';

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

export const CreateGroup: FC<NativeStackScreenProps<RootStackParamList, 'AddGroup'>> = ({
  navigation,
}) => {
  const inputRef = createRef<TextInput>();

  const [newName, setNewName] = useState<string>('');
  const [newDesc, setDesc] = useState<string>('');
  const { dbConn } = useContext(globalContext);

  const updateName = useCallback((_e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    setNewName(_e.nativeEvent.text);
  }, []);
  const updateDesc = useCallback((_e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    setDesc(_e.nativeEvent.text);
  }, []);

  const addTag = useCallback(async () => {
    if (!dbConn) {
      return;
    }
    if (!newName) {
      Alert.alert('a name is required');
      return;
    }
    const newTag = new EGroup();
    newTag.name = newName;
    newTag.tagId = nanoid();
    newTag.desc = newDesc;
    dbConn.manager
      .save(newTag)
      .then((_res) => {
        inputRef.current?.clear();
        navigation.goBack();
      })
      .catch((err) => {
        console.log('🚀 ~ file: CreateTag.tsx:48 ~ addTag ~ err:', err);
      });
  }, [dbConn, inputRef, navigation, newDesc, newName]);
  return (
    <View style={styles.container}>
      <View style={styles.inputs}>
        <View>
          <Text style={styles.title}>name</Text>
          <TextInput style={styles.nameInput} onChange={updateName} ref={inputRef} />
        </View>
        <View>
          <Text style={styles.title}>description</Text>
          <TextInput style={styles.descInput} multiline={true} onChange={updateDesc} />
        </View>
      </View>
      <Pressable onPress={addTag}>
        <View style={styles.confirmButton}>
          <Text style={styles.confirmText}>confirm</Text>
        </View>
      </Pressable>
    </View>
  );
};
