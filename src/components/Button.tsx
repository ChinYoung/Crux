import { FC, useCallback, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LIGHT_DEFAULT_COLOR } from '../theme/color';

export const PrimaryButton: FC<{ name: string; pressHandler: () => void }> = ({
  pressHandler,
  name,
}) => {
  return (
    <BaseButton
      pressHandler={pressHandler}
      name={name}
      color={LIGHT_DEFAULT_COLOR.button.primary}
    />
  );
};

export const SecondaryButton: FC<{ name: string; pressHandler: () => void }> = ({
  pressHandler,
  name,
}) => {
  return (
    <BaseButton
      pressHandler={pressHandler}
      name={name}
      color={LIGHT_DEFAULT_COLOR.button.secondary}
    />
  );
};

export const NegtiveButton: FC<{ name: string; pressHandler: () => void }> = ({
  pressHandler,
  name,
}) => {
  return (
    <BaseButton
      pressHandler={pressHandler}
      name={name}
      color={LIGHT_DEFAULT_COLOR.button.negtive}
      textColor={LIGHT_DEFAULT_COLOR.text.negtive}
    />
  );
};

export const ErrorButton: FC<{ name: string; pressHandler: () => void }> = ({
  pressHandler,
  name,
}) => {
  return (
    <BaseButton
      pressHandler={pressHandler}
      name={name}
      color={LIGHT_DEFAULT_COLOR.button.error}
      textColor={LIGHT_DEFAULT_COLOR.text.error}
    />
  );
};

const BaseButton: FC<{
  color: string;
  textColor?: string;
  name: string;
  pressHandler: () => void;
}> = ({ pressHandler, name, color, textColor = '#fff' }) => {
  const styles = StyleSheet.create({
    pressed: {
      backgroundColor: color,
      opacity: 0.5,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 8,
      width: '100%',
    },
    notPressed: {
      backgroundColor: color,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 8,
      width: '100%',
    },
    confirmButton: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    },
    confirmText: {
      color: textColor,
      fontWeight: 'bold',
    },
  });
  const hoverOutHandler = useCallback(() => {
    console.log('-------------');
  }, []);
  return (
    <Pressable
      onPress={pressHandler}
      onHoverOut={hoverOutHandler}
      style={({ pressed }) => (pressed ? [styles.pressed] : [styles.notPressed])}
    >
      <View style={[styles.confirmButton]}>
        <Text style={styles.confirmText} numberOfLines={1}>
          {name}
        </Text>
      </View>
    </Pressable>
  );
};
