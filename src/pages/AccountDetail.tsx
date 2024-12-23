import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  createRef,
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
import { Keyboard, Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { globalContext } from '../context/globalContext';
import { StyleSheet } from 'react-native';
import { EExtendItem, ExtendItemType } from '../entities/EExtendItem';
import { EAccount } from '../entities/EAccount';
import { ErrorButton, PrimaryButton, SecondaryButton } from '../components/Button';
import { Alert } from 'react-native';
import { createExtendField, FieldEditor } from '../components/FieldEditor';
import { AddFieldButton } from '../components/AddFieldButton';
import { CustomInput } from '../components/CustomInput';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { confirmHof } from '../utils/hof';
import { GlobalStyles } from '../global/styles';
import { SafeWithHeaderKeyboardAvoidingView } from '../components/SafeWithHeaderKeyboardAvoidingView';
import { useAccountCurd } from '../hooks/useAccount';
import { Gap } from '../components/Gap';
import { useClickOutside } from 'react-native-click-outside';

type FormProps = { defaultAccount?: EAccount; isEditing?: boolean };

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
    padding: 12,
    rowGap: 12,
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

const AccountForm = forwardRef<any, FormProps>(({ defaultAccount, isEditing = true }, ref) => {
  const [name, setName] = useState<string>('');
  const [desc, setDesc] = useState<string>('');
  const [extendedItems, setExtendedItems] = useState<EExtendItem[]>([]);

  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  const containerRef = createRef<ScrollView>();
  const nameInputRef = createRef<TextInput>();

  const clickRef = useClickOutside<View>(() => setShowAddModal(false));

  useImperativeHandle(ref, () => {
    return {
      getValues() {
        return {
          name,
          desc,
          extendedItems: extendedItems.filter((i) => !!i.name),
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

  const addNewTextField = useCallback(() => {
    const { newExtendItem } = createExtendField(ExtendItemType.text);
    setExtendedItems([...extendedItems, newExtendItem] as EExtendItem[]);
    containerRef.current?.scrollToEnd({ animated: true });
  }, [containerRef, extendedItems]);

  const addNewImageField = useCallback(() => {
    const { newExtendItem } = createExtendField(ExtendItemType.image);
    setExtendedItems([...extendedItems, newExtendItem] as EExtendItem[]);
    containerRef.current?.scrollToEnd({ animated: true });
  }, [containerRef, extendedItems]);

  const addText = useCallback(() => {
    addNewTextField();
    setShowAddModal(false);
  }, [addNewTextField]);

  const addImage = useCallback(() => {
    addNewImageField();
    setShowAddModal(false);
  }, [addNewImageField]);

  useEffect(() => {
    setName(defaultAccount?.name ?? '');
    setDesc(defaultAccount?.desc ?? '');
    setExtendedItems(defaultAccount?.extendedItems ?? []);
  }, [defaultAccount?.desc, defaultAccount?.extendedItems, defaultAccount?.name]);

  const [oneTimeToggle, setOnetimeToggle] = useState<boolean>();

  useEffect(() => {
    if (!isEditing) {
      setOnetimeToggle(false);
      return;
    }
    if (!oneTimeToggle) {
      containerRef.current?.scrollTo({ y: 0, animated: true });
      nameInputRef.current?.focus();
      setOnetimeToggle(true);
    }
  }, [containerRef, isEditing, nameInputRef, oneTimeToggle]);

  return (
    <>
      <Modal visible={showAddModal} transparent={true} animationType="none">
        <Pressable
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 20,
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
        >
          <View
            style={{
              borderRadius: 8,
              paddingVertical: 32,
              paddingHorizontal: 32,
              gap: 8,
              backgroundColor: '#F5EFFF',
              justifyContent: 'center',
              alignItems: 'center',
              width: 320,
            }}
            ref={clickRef}
          >
            <SecondaryButton pressHandler={addText} name="text" />
            <SecondaryButton pressHandler={addImage} name="image" />
            <Gap />
            <ErrorButton pressHandler={() => setShowAddModal(false)} name="cancel" />
          </View>
        </Pressable>
      </Modal>
      <ScrollView
        ref={containerRef}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="always"
      >
        {isEditing ? (
          <View>
            <Text>Name</Text>
            <CustomInput multiple={false} onChange={setName} value={name} ref={nameInputRef} />
          </View>
        ) : null}
        {isEditing ? (
          <View>
            <Text>Dscription</Text>
            <CustomInput multiple={true} onChange={setDesc} value={desc} />
          </View>
        ) : (
          <View>
            <Text style={GlobalStyles.description}>{defaultAccount?.desc}</Text>
          </View>
        )}
        {extendedItems.map((_e) => {
          return isEditing ? (
            <FieldEditor
              type={_e.type}
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
            <AddFieldButton
              onClick={() => {
                if (Keyboard.isVisible()) {
                  Keyboard.dismiss();
                }
                setTimeout(() => {
                  setShowAddModal(true);
                }, 100);
              }}
            />
          </View>
        )}
      </ScrollView>
    </>
  );
});

export const AddAccount: FC<NativeStackScreenProps<RootStackParamList, 'AddAccount'>> = ({
  navigation,
  route,
}) => {
  const { createNewAccount } = useAccountCurd();
  const { dbConn } = useContext(globalContext);
  const { groupId } = route.params;
  const formRef = useRef<{ getValues: () => EAccount }>();

  const create = useCallback(async () => {
    const values = formRef.current?.getValues();
    if (!values) {
      return;
    }
    if (!values.name) {
      Alert.alert('a name is required');
      return;
    }
    await createNewAccount(groupId, values);
    navigation.goBack();

    if (!dbConn) {
      return;
    }
  }, [createNewAccount, dbConn, groupId, navigation]);

  return (
    <SafeWithHeaderKeyboardAvoidingView>
      <View style={[styles.container]}>
        <AccountForm isEditing={true} ref={formRef} />
        {/* buttons on the bottom */}
        <View style={styles.operations}>
          <View style={styles.addExtentdButtonContainer}>
            <PrimaryButton pressHandler={create} name="Save" />
          </View>
        </View>
      </View>
    </SafeWithHeaderKeyboardAvoidingView>
  );
};

export const AccountDetail: FC<NativeStackScreenProps<RootStackParamList, 'AccountDetail'>> = ({
  navigation,
  route,
}) => {
  const { accountId } = route.params;
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const formRef = useRef<{ getValues: () => EAccount }>();

  const startEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  const { account, deleteAccount, updateAccount, refresh } = useAccountCurd(accountId);

  const update = useCallback(async () => {
    const values = formRef.current?.getValues();
    if (!values) {
      return;
    }
    const res = await updateAccount(values);
    await refresh();
    console.log('🚀 ~ update ~ res:', res);
    setIsEditing(false);
  }, [refresh, updateAccount]);

  const deleteSelf = useCallback(async () => {
    await deleteAccount();
    navigation.goBack();
  }, [deleteAccount, navigation]);

  useEffect(() => {
    navigation.setOptions({
      title: account?.name,
      headerRight: () => (
        <Pressable onPress={confirmHof(deleteSelf)}>
          <FontAwesomeIcon color="red" icon={faTrash} />
        </Pressable>
      ),
    });
  }, [deleteSelf, account?.name, navigation]);

  return (
    <SafeWithHeaderKeyboardAvoidingView>
      <View style={[styles.container, GlobalStyles.debug]}>
        <AccountForm defaultAccount={account} isEditing={isEditing} ref={formRef} />
        {/* buttons on the bottom */}
        <View style={styles.operations}>
          <View style={styles.addExtentdButtonContainer}>
            {isEditing && <PrimaryButton pressHandler={update} name="Save" />}
            {!isEditing && <PrimaryButton pressHandler={startEdit} name="Edit" />}
          </View>
        </View>
      </View>
    </SafeWithHeaderKeyboardAvoidingView>
  );
};
