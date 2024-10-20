import 'react-native-get-random-values';
import { nanoid } from 'nanoid';
import { createRef, FC, forwardRef, Ref, RefObject, useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { confirmHof } from '../utils/hof';
import { GlobalStyles } from '../global/styles';

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
  deleteIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  labelContainer: {
    width: '65%',
  },
  inputContainer: {
    borderStyle: 'solid',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    overflow: 'hidden',
    height: 40,
  },
  input: {
    height: 40,
  },
});

export type FieldFunctions = {
  updateLabel: (id: string, newLabel: string) => void;
  updateContent: (id: string, newContent: string) => void;
  validate?: (id: string, label: string, content: string) => void;
  deleteField: (id: string) => void;
};

export const FieldEditor = forwardRef<
  { label: RefObject<TextInput>; content: RefObject<TextInput> },
  CustomField & FieldFunctions
>(
  (
    {
      extendItemId: itemId,
      name,
      content,
      labelError,
      contentError,
      updateContent,
      updateLabel,
      deleteField,
      validate,
    },
    ref,
  ) => {
    const containerRef = createRef<View>();
    const labelInput = createRef<TextInput>();
    const contentInput = createRef<TextInput>();

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
    const onDelete = useCallback(() => {
      deleteField(itemId);
    }, [deleteField, itemId]);

    useEffect(() => {
      labelInput.current?.focus();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <View style={[styles.root]} ref={containerRef}>
        <View style={[styles.deleteIcon]}>
          <Pressable onPress={confirmHof(onDelete)}>
            <FontAwesomeIcon color="red" icon={faTrash} />
          </Pressable>
        </View>
        <View style={[styles.labelContainer, styles.inputContainer]}>
          <TextInput
            ref={labelInput}
            style={[styles.input]}
            placeholder="Input Field Name Here"
            onChangeText={onInputLabel}
            value={name}
            autoCapitalize="none"
          />
        </View>
        <View style={[styles.inputContainer]}>
          <TextInput
            ref={contentInput}
            style={[styles.input]}
            placeholder="Input Field Value Here"
            value={content}
            onChangeText={onInputContent}
            autoCapitalize="none"
          />
        </View>
      </View>
    );
  },
);
