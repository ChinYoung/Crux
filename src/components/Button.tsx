import { FC, useCallback } from 'react';
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
    },
    notPressed: {
      backgroundColor: color,
      borderRadius: 8,
    },
    confirmButton: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 8,
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
      style={({ pressed }) => (pressed ? styles.pressed : styles.notPressed)}
    >
      <View style={styles.confirmButton}>
        <Text style={styles.confirmText}>{name}</Text>
      </View>
    </Pressable>
  );
};
