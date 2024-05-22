import { FC, useCallback } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

export type CustomField = {
  id: string;
  label: string;
  content: string;
  labelError: string;
  contentError: string;
};

export type FieldFunctions = {
  validate: (id: string, label: string, content: string) => void;
  updateLabel: (id: string, newLabel: string) => void;
  updateContent: (id: string, newContent: string) => void;
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
    width: '45%',
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
  id,
  label,
  content,
  labelError,
  contentError,
  updateContent,
  updateLabel,
  validate,
}) => {
  const onInputLabel = useCallback(
    (text: string) => {
      updateLabel(id, text);
    },
    [id, updateLabel],
  );
  const onInputContent = useCallback(
    (text: string) => {
      updateContent(id, text);
    },
    [id, updateContent],
  );
  return (
    <View style={[styles.root]}>
      <View style={[styles.labelContainer]}>
        <TextInput
          placeholder="Input Field Name Here"
          onChangeText={onInputLabel}
          value={label}
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
