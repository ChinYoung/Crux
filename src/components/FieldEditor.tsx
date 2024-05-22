import { FC } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

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

export const FieldEditor: FC<{ label: string; err?: string; onBlur?: () => void }> = ({
  label,
  err,
  onBlur,
}) => {
  return (
    <View style={[styles.root]}>
      <View style={[styles.labelContainer]}>
        <TextInput placeholder="Input Field Name Here" />
      </View>
      <View style={[styles.inputContainer]}>
        <TextInput placeholder="Input Field Value Here" />
      </View>
    </View>
  );
};
