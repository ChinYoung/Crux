import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FC, createRef, useCallback, useContext, useEffect, useState } from 'react';
import { RootStackParamList } from '../route/Router';
import {
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
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
import { PrimaryButton } from '../components/Button';
import { SafeWithHeaderKeyboardAvoidingView } from '../components/SafeWithHeaderKeyboardAvoidingView';
import { CustomInput } from '../components/CustomInput';
import { AddFieldButton } from '../components/AddFieldButton';
import { CustomField, FieldEditor } from '../components/FieldEditor';

export const AddAccount: FC<NativeStackScreenProps<RootStackParamList, 'AddItem'>> = ({
  navigation,
  route,
}) => {
  const { dbConn } = useContext(globalContext);
  const { tagId, tagName } = route.params;
  const [fields, setFields] = useState<Record<string, CustomField>>({});

  const [account, setAccount] = useState<string>('');
  const [newName, setNewName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [newDesc, setDesc] = useState<string>('');

  const updateAccount = useCallback((val: string) => {
    setAccount(val);
  }, []);
  const updateName = useCallback((val: string) => {
    setNewName(val);
  }, []);
  const updatePassword = useCallback((val: string) => {
    setPassword(val);
  }, []);
  const updateDesc = useCallback((val: string) => {
    setDesc(val);
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

  const validateField = useCallback(
    (id: string, label: string, content: string) => {
      if (label && content) {
        return;
      }
      const field = fields[id];
      setFields({
        ...fields,
        [id]: {
          ...field,
          labelError: !label ? 'Label is required' : '',
          contentError: !content ? 'Content is required' : '',
        },
      });
    },
    [fields],
  );
  const updateLabel = useCallback((id: string, label: string) => {
    console.log('🚀 ~ updateLabel ~ label:', label);
    console.log('🚀 ~ updateLabel ~ id:', id);
  }, []);
  const updateContent = useCallback((id: string, content: string) => {}, []);

  const addField = useCallback(() => {
    const newFieldId = nanoid();
    setFields({
      ...fields,
      [newFieldId]: {
        id: newFieldId,
        label: '',
        content: '',
        labelError: '',
        contentError: '',
        validate: validateField,
        updateLabel,
        updateContent,
      },
    });
  }, [fields, updateContent, updateLabel, validateField]);

  return (
    <SafeWithHeaderKeyboardAvoidingView>
      <View style={[styles.container]}>
        <View style={[styles.fields]}>
          <ScrollView contentContainerStyle={[styles.inputs]}>
            <View>
              <Text>Name</Text>
              <CustomInput multiple={false} onChange={updateName} />
            </View>
            <View>
              <Text>Account</Text>
              <CustomInput multiple={false} onChange={updateAccount} />
            </View>
            <View>
              <Text>Password</Text>
              <CustomInput multiple={false} onChange={updatePassword} />
            </View>
            <View>
              <Text>Dscription</Text>
              <CustomInput multiple={true} onChange={updateDesc} />
            </View>
            {Object.values(fields).map((f) => (
              <FieldEditor
                label={f.label}
                key={f.id}
                content={f.content}
                contentError={f.contentError}
                id={f.id}
                labelError={f.labelError}
                updateContent={updateContent}
                updateLabel={updateLabel}
                validate={validateField}
              />
            ))}
            <View>
              <AddFieldButton onClick={addField} />
            </View>
          </ScrollView>
        </View>
        <PrimaryButton pressHandler={addItem} name="Confirm" />
      </View>
    </SafeWithHeaderKeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between',
    padding: 8,
  },
  fields: {
    height: '80%',
  },
  inputs: {
    display: 'flex',
    gap: 16,
    paddingBottom: 30,
    paddingHorizontal: 8,
  },
  input: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 4,
    padding: 4,
  },
  descInput: {
    borderStyle: 'solid',
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
