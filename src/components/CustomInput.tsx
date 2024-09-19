import { ForwardRefRenderFunction, forwardRef, useCallback, useState } from 'react';
import {
  NativeSyntheticEvent,
  StyleSheet,
  TextInput,
  TextInputChangeEventData,
  View,
} from 'react-native';

const styles = StyleSheet.create({
  inputContainer: {
    borderStyle: 'solid',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
  },
  activated: {
    borderColor: '#99f',
    borderWidth: 2,
  },
  input: {
    height: 36,
  },
  multipleInput: {
    height: 72,
  },
});
const CustomInputComponent: ForwardRefRenderFunction<
  TextInput,
  { value?: string; multiple: boolean; onChange: (val: string) => void }
> = ({ onChange, multiple, value }, ref) => {
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
    <View style={[styles.inputContainer, isActivated ? styles.activated : null]}>
      <TextInput
        style={[multiple ? styles.multipleInput : styles.input]}
        ref={ref}
        multiline={multiple}
        autoCapitalize="none"
        onChange={onChangeHandler}
        onFocus={activate}
        onBlur={deactivate}
        value={value}
      />
    </View>
  );
};

export const CustomInput = forwardRef(CustomInputComponent);
