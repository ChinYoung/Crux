import { FC, useCallback, useState } from 'react';
import {
  NativeSyntheticEvent,
  StyleSheet,
  TextInput,
  TextInputChangeEventData,
  View,
} from 'react-native';

const styles = StyleSheet.create({
  inputContainer: {
    display: 'flex',
    borderStyle: 'solid',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    minHeight: 36,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  multipleInputContainer: {
    minHeight: 76,
  },
  input: {
    flex: 1,
  },
  activated: {
    borderColor: '#99f',
    borderWidth: 2,
  },
});
export const CustomInput: FC<{ multiple: boolean; onChange: (val: string) => void }> = ({
  onChange,
  multiple,
}) => {
  const [isActivated, setIsActivated] = useState(false);
  const onChangeHandler = useCallback(
    (_e: NativeSyntheticEvent<TextInputChangeEventData>) => {
      onChange(_e.nativeEvent.text);
    },
    [onChange],
  );
  const activate = useCallback(() => {
    setIsActivated(true);
  }, []);
  const deactivate = useCallback(() => {
    setIsActivated(false);
  }, []);
  return (
    <View
      style={[
        styles.inputContainer,
        multiple ? styles.multipleInputContainer : null,
        isActivated ? styles.activated : null,
      ]}
    >
      <TextInput
        style={styles.input}
        multiline={multiple}
        onChange={onChangeHandler}
        onFocus={activate}
        onBlur={deactivate}
      />
    </View>
  );
};
