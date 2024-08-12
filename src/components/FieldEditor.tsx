import 'react-native-get-random-values';
import { nanoid } from 'nanoid';
import { FC, useCallback } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

export type CustomField = {
  extendItemId: string;
  name: string;
  content: string;
  labelError?: string;
  contentError?: string;
};

export function createExtendField() {
  const newFieldId = nanoid();
  return {
    newFieldId,
    newExtendItem: {
      extendItemId: newFieldId,
      name: '',
      content: '',
      labelError: '',
      contentError: '',
    } as CustomField,
  };
}

export type FieldFunctions = {
  updateLabel: (id: string, newLabel: string) => void;
  updateContent: (id: string, newContent: string) => void;
  validate?: (id: string, label: string, content: string) => void;
};

const styles = StyleSheet.create({
  root: {
    width: '100%',
    display: 'flex',
    gap: 8,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#ccc',
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  labelContainer: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    width: '65%',
    paddingVertical: 4,
  },
  inputContainer: {
    borderStyle: 'solid',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
});

export const FieldEditor: FC<CustomField & FieldFunctions> = ({
  extendItemId: itemId,
  name,
  content,
  labelError,
  contentError,
  updateContent,
  updateLabel,
  validate,
}) => {
  const onInputLabel = useCallback(
    (text: string) => {
      updateLabel(itemId, text);
    },
    [itemId, updateLabel],
  );
  const onInputContent = useCallback(
    (text: string) => {
      updateContent(itemId, text);
    },
    [itemId, updateContent],
  );
  return (
    <View style={[styles.root]}>
      <View style={[styles.labelContainer]}>
        <TextInput
          placeholder="Input Field Name Here"
          onChangeText={onInputLabel}
          value={name}
          autoCapitalize="none"
        />
      </View>
      <View style={[styles.inputContainer]}>
        <TextInput
          placeholder="Input Field Value Here"
          value={content}
          onChangeText={onInputContent}
          autoCapitalize="none"
        />
      </View>
    </View>
  );
};
