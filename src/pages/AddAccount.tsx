import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FC, useCallback, useContext, useEffect, useState } from 'react';
import { RootStackParamList } from '../route/Router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
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
import { EExtendItem } from '../entities/EExtendItem';

const DefaultFields: CustomField = {
  id: 'name',
  content: '',
  contentError: '',
  label: '',
  labelError: '',
};

export const AddAccount: FC<NativeStackScreenProps<RootStackParamList, 'AddItem'>> = ({
  navigation,
  route,
}) => {
  const { dbConn } = useContext(globalContext);
  const { tagId, tagName } = route.params;
  const [fields, setFields] = useState<Record<string, CustomField>>({
    name: DefaultFields,
  });

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
      .then((group) => {
        if (!group) {
          return;
        }
        const newAccount = new EAccount();
        newAccount.name = newName;
        newAccount.account = account;
        newAccount.password = password;
        newAccount.desc = newDesc;
        newAccount.accountId = nanoid();
        newAccount.extendedItems = Object.values(fields).map((i) => ({
          name: i.label,
          content: i.content,
        })) as EExtendItem[];
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
  }, [dbConn, newName, tagId, account, password, newDesc, fields, navigation]);

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
  const updateLabel = useCallback(
    (id: string, label: string) => {
      setFields(
        Object.fromEntries(
          Object.entries(fields).map(([k, v]) => [k, v.id === id ? { ...v, label } : v]),
        ),
      );
    },
    [fields],
  );
  const updateContent = useCallback(
    (id: string, content: string) => {
      setFields(
        Object.fromEntries(
          Object.entries(fields).map(([k, v]) => [k, v.id === id ? { ...v, content } : v]),
        ),
      );
    },
    [fields],
  );

  const addNewField = useCallback(() => {
    const newFieldId = nanoid();
    setFields({
      ...fields,
      [newFieldId]: {
        id: newFieldId,
        label: '',
        content: '',
        labelError: '',
        contentError: '',
      },
    });
  }, [fields]);

  return (
    <SafeWithHeaderKeyboardAvoidingView>
      <View style={[styles.container]}>
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
              key={f.id}
              label={f.label}
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
            <AddFieldButton onClick={addNewField} />
          </View>
        </ScrollView>
      </View>
      <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
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
    padding: 12,
  },
  inputs: {
    display: 'flex',
    gap: 16,
    paddingBottom: 8,
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
