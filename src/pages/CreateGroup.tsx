import { FC, createRef, useCallback, useContext, useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { globalContext } from '../context/globalContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../route/Router';
import 'react-native-get-random-values';
import { nanoid } from 'nanoid';
import { EGroup } from '../entities/EGroup';
import { PredefinedColor, PredefinedColorList } from '../lib/Constants';
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
  colorContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 4,
    flexWrap: 'wrap',
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
  const [selectedColor, setSelectedColor] = useState<PredefinedColor>(PredefinedColorList.dark[0]);

  const updateName = useCallback((val: string) => {
    setNewName(val);
  }, []);
  const updateDesc = useCallback((val: string) => {
    setDesc(val);
  }, []);

  const onSelectColor = useCallback((color: PredefinedColor) => {
    setSelectedColor(color);
  }, []);

  const addGroup = useCallback(async () => {
    if (!dbConn) {
      Alert.alert('no db connection');
      return;
    }
    if (!newName) {
      Alert.alert('a name is required');
      return;
    }
    const newGroup = new EGroup();
    newGroup.name = newName;
    newGroup.groupId = nanoid();
    newGroup.desc = newDesc;
    newGroup.backgroundColor = selectedColor.id;
    dbConn.manager
      .save(newGroup)
      .then((_res) => {
        inputRef.current?.clear();
        navigation.goBack();
      })
      .catch((err) => {
        console.log('🚀 ~ file: CreateTag.tsx:48 ~ addTag ~ err:', err);
      });
  }, [dbConn, inputRef, navigation, newDesc, newName, selectedColor]);

  useEffect(() => {
    inputRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <SafeWithHeaderKeyboardAvoidingView>
      <View style={styles.content}>
        {/* top, inputs */}
        <View style={styles.inputs}>
          {/* name */}
          <View>
            <Text style={styles.title}>A Name For The Group</Text>
            <CustomInput multiple={false} onChange={updateName} ref={inputRef} />
          </View>
          {/* desc */}
          <View>
            <Text style={styles.title}>Description For The Group</Text>
            <CustomInput multiple={true} onChange={updateDesc} />
          </View>
          {/* color picker */}
          <View>
            <Text style={styles.title}>Pick A Color</Text>
            <View style={styles.colorContainer}>
              {PredefinedColorList.dark.map((color) => (
                <ColorButton
                  key={color.id}
                  isDark={true}
                  color={color}
                  onClick={onSelectColor}
                  isSelected={selectedColor.id === color.id}
                />
              ))}
              {PredefinedColorList.light.map((color) => (
                <ColorButton
                  key={color.id}
                  isDark={false}
                  color={color}
                  onClick={onSelectColor}
                  isSelected={selectedColor.id === color.id}
                />
              ))}
            </View>
          </View>
        </View>
        {/* bottom buttons */}
        {/* <TextInput style={styles.nameInput} onChange={updateName} ref={inputRef} /> */}
        <View style={{ width: '100%' }}>
          <PrimaryButton pressHandler={addGroup} name="confirm" />
        </View>
      </View>
    </SafeWithHeaderKeyboardAvoidingView>
  );
};

const ColorButton: FC<{
  isSelected: boolean;
  isDark: boolean;
  color: PredefinedColor;
  onClick: (color: PredefinedColor) => void;
}> = ({ isSelected, isDark, color, onClick }) => {
  const ColorButtonStyle = StyleSheet.create({
    container: {
      width: 48,
      height: 32,
      borderRadius: 4,
    },
    darkBgContent: {
      backgroundColor: color.backgroundColor,
    },
    lightBgContent: {
      backgroundColor: color.backgroundColor,
    },
    selected: {
      borderWidth: 2,
      borderStyle: 'dotted',
    },
    darkBorder: {
      borderColor: 'white',
    },
    lightBorder: {
      borderColor: 'white',
    },
  });
  return (
    <Pressable onPress={() => onClick(color)}>
      <View
        style={[
          ColorButtonStyle.container,
          ColorButtonStyle.darkBgContent,
          isSelected ? ColorButtonStyle.selected : null,
          isDark ? ColorButtonStyle.darkBorder : ColorButtonStyle.lightBorder,
        ]}
      />
    </Pressable>
  );
};
