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
import { SafeAreaView } from 'react-native-safe-area-context';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: '100%',
  },
  inputs: {
    display: 'flex',
    gap: 16,
  },
  title: {
    color: '#000',
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

  const updateName = useCallback((_e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    setNewName(_e.nativeEvent.text);
  }, []);
  const updateDesc = useCallback((_e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    setDesc(_e.nativeEvent.text);
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
    <SafeAreaView>
      <View style={styles.container}>
        {/* top, inputs */}
        <View style={styles.inputs}>
          <View>
            <Text style={styles.title}>name</Text>
            <TextInput style={styles.nameInput} onChange={updateName} ref={inputRef} />
          </View>
          <View>
            <Text style={styles.title}>description</Text>
            <TextInput style={styles.descInput} multiline={true} onChange={updateDesc} />
          </View>
          {/* color picker */}
          <View>
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
        <PrimaryButton pressHandler={addTag} name="confirm" />
      </View>
    </SafeAreaView>
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
