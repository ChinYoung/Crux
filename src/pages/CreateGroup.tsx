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
import { PredefinedColors } from '../lib/Constants';
import { LIGHT_DEFAULT_COLOR } from '../theme/color';
import { PrimaryButton } from '../components/Button';
import { SafeWithHeaderKeyboardAvoidingView } from '../components/SafeWithHeaderKeyboardAvoidingView';
import { CustomInput } from '../components/CustomInput';

const styles = StyleSheet.create({
  content: {
    flex: 1,
    display: 'flex',
    position: 'relative',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  inputs: {
    display: 'flex',
    gap: 16,
  },
  title: {
    color: '#000',
  },
  confirmButton: {
    backgroundColor: LIGHT_DEFAULT_COLOR.button.primary,
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

  const updateName = useCallback((val: string) => {
    setNewName(val);
  }, []);
  const updateDesc = useCallback((val: string) => {
    setDesc(val);
  }, []);

  const onSelectColor = useCallback((color: string) => {
    console.log('🚀 ~ file: CreateGroup.tsx:78 ~ onSelectColor ~ color:', color);
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
    <SafeWithHeaderKeyboardAvoidingView>
      <View style={styles.content}>
        {/* top, inputs */}
        <View style={styles.inputs}>
          <View>
            <Text style={styles.title}>name</Text>
            <CustomInput multiple={false} onChange={updateName} />
          </View>
          <View>
            <Text style={styles.title}>description</Text>
            <CustomInput multiple={true} onChange={updateDesc} />
          </View>
          {/* color picker */}
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Color</Text>
            <View>
              {PredefinedColors.dark.map((color) => (
                <ColorButton key={color} isDark={true} color={color} onClick={onSelectColor} />
              ))}
              <Text>color</Text>
            </View>
          </View>
        </View>
        {/* bottom buttons */}
        {/* <TextInput style={styles.nameInput} onChange={updateName} ref={inputRef} /> */}
        <View style={{ width: '100%' }}>
          <PrimaryButton pressHandler={addTag} name="confirm" />
        </View>
      </View>
    </SafeWithHeaderKeyboardAvoidingView>
  );
};

const ColorButton: FC<{ isDark: boolean; color: string; onClick: (color: string) => void }> = ({
  isDark,
  color,
  onClick,
}) => {
  const ColorButtonStyle = StyleSheet.create({
    container: {
      width: 16,
      height: 16,
    },
    darkBgContent: {
      backgroundColor: color,
      color: '#fff',
    },
    lightBgContent: {
      backgroundColor: color,
      color: '#000',
    },
  });
  return (
    <Pressable onPress={() => onClick(color)} style={ColorButtonStyle.container}>
      <Text style={isDark ? ColorButtonStyle.darkBgContent : ColorButtonStyle.lightBgContent}>
        {color}
      </Text>
    </Pressable>
  );
};
