import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FC, createRef, useCallback, useContext, useEffect, useState } from 'react';
import { RootStackParamList } from '../route/Router';
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
import { globalContext } from '../context/globalContext';
import { EGroup } from '../entities/EGroup';
import 'react-native-get-random-values';
import { nanoid } from 'nanoid';
import { EAccount } from '../entities/EAccount';

export const AddAccount: FC<NativeStackScreenProps<RootStackParamList, 'AddItem'>> = ({
  navigation,
  route,
}) => {
  const { dbConn } = useContext(globalContext);
  const inputRef = createRef<TextInput>();
  const { tagId, tagName } = route.params;

  const [account, setAccount] = useState<string>('');
  const [newName, setNewName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [newDesc, setDesc] = useState<string>('');

  const updateAccount = useCallback((_e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    setAccount(_e.nativeEvent.text);
  }, []);
  const updateName = useCallback((_e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    setNewName(_e.nativeEvent.text);
  }, []);
  const updatePassword = useCallback((_e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    setPassword(_e.nativeEvent.text);
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
      .findOne(EGroup, {
        where: { tagId },
        relations: { accountList: true },
      })
      .then((tag) => {
        if (!tag) {
          return;
        }
        const newAccount = new EAccount();
        newAccount.name = newName;
        newAccount.account = account;
        newAccount.password = password;
        newAccount.desc = newDesc;
        newAccount.accountId = nanoid();
        tag.accountList.push(newAccount);
        dbConn.manager
          .save(tag)
          .then((_res) => {
            navigation.goBack();
          })
          .catch((err) => {
            console.log('🚀 ~ file: CreateTag.tsx:48 ~ addTag ~ err:', err);
          });
      });
  }, [account, dbConn, navigation, password, newDesc, newName, tagId]);

  useEffect(() => {
    navigation.setOptions({
      title: `Create an account`,
    });
  }, [navigation, tagName]);

  return (
    <View style={styles.container}>
      <View style={styles.inputs}>
        <View>
          <Text style={styles.title}>Name</Text>
          <TextInput style={styles.input} onChange={updateName} ref={inputRef} />
        </View>
        <View>
          <Text style={styles.title}>Account</Text>
          <TextInput style={styles.input} onChange={updateAccount} ref={inputRef} />
        </View>
        <View>
          <Text style={styles.title}>Password</Text>
          <TextInput style={styles.input} onChange={updatePassword} ref={inputRef} />
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
    color: '#000',
  },
  input: {
    borderStyle: 'solid',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 4,
    padding: 4,
  },
  descInput: {
    borderStyle: 'solid',
    borderColor: '#ddd',
    borderWidth: 1,
    minHeight: 64,
    borderRadius: 4,
    padding: 4,
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
