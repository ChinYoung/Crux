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
import { createExtendField, CustomField, FieldEditor } from '../components/FieldEditor';
import { EExtendItem } from '../entities/EExtendItem';

const { newFieldId: firstId, newExtendItem: firstItem } = createExtendField();
export const AddAccount: FC<NativeStackScreenProps<RootStackParamList, 'AddItem'>> = ({
  navigation,
  route,
}) => {
  const [extendItems, setExtendItems] = useState<Record<string, CustomField>>({
    [firstId]: firstItem,
  });
  const { dbConn } = useContext(globalContext);
  const { groupId } = route.params;

  console.log('🚀 ~ extendItems:', extendItems);
  const [newName, setNewName] = useState<string>('');
  const [newDesc, setDesc] = useState<string>('');

  const updateName = useCallback((val: string) => {
    setNewName(val);
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
        where: { groupId },
        relations: { accountList: true },
      })
      .then((group) => {
        if (!group) {
          return;
        }
        const newAccount = new EAccount();
        newAccount.name = newName;
        newAccount.desc = newDesc;
        newAccount.accountId = nanoid();
        newAccount.extendedItems = Object.values(extendItems).map((i) => ({
          extendItemId: i.extendItemId,
          name: i.name,
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
  }, [dbConn, newName, groupId, newDesc, extendItems, navigation]);

  useEffect(() => {
    navigation.setOptions({
      title: `Create an account`,
    });
  }, [navigation]);

  const validateExtendedField = useCallback(
    (id: string, label: string, content: string) => {
      if (label && content) {
        return;
      }
      const field = extendItems[id];
      setExtendItems({
        ...extendItems,
        [id]: {
          ...field,
          labelError: !label ? 'Label is required' : '',
          contentError: !content ? 'Content is required' : '',
        },
      });
    },
    [extendItems],
  );
  const updateExtendedLabel = useCallback(
    (itemId: string, name: string) => {
      setExtendItems(
        Object.fromEntries(
          Object.entries(extendItems).map(([k, v]) => [
            k,
            v.extendItemId === itemId ? { ...v, name } : v,
          ]),
        ),
      );
    },
    [extendItems],
  );
  const updateExtendedContent = useCallback(
    (itemId: string, content: string) => {
      setExtendItems(
        Object.fromEntries(
          Object.entries(extendItems).map(([k, v]) => [
            k,
            v.extendItemId === itemId ? { ...v, content } : v,
          ]),
        ),
      );
    },
    [extendItems],
  );

  const addNewField = useCallback(() => {
    const { newFieldId, newExtendItem } = createExtendField();
    setExtendItems({
      ...extendItems,
      [newFieldId]: newExtendItem,
    });
  }, [extendItems]);

  return (
    <SafeWithHeaderKeyboardAvoidingView>
      <View style={[styles.container]}>
        <ScrollView contentContainerStyle={[styles.inputs]}>
          <View>
            <Text>Name</Text>
            <CustomInput multiple={false} onChange={updateName} />
          </View>
          <View>
            <Text>Dscription</Text>
            <CustomInput multiple={true} onChange={updateDesc} />
          </View>
          {Object.values(extendItems).map((f) => (
            <FieldEditor
              key={f.extendItemId}
              name={f.name}
              content={f.content}
              contentError={f.contentError}
              extendItemId={f.extendItemId}
              labelError={f.labelError}
              updateContent={updateExtendedContent}
              updateLabel={updateExtendedLabel}
              validate={validateExtendedField}
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
