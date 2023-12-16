import { FC } from 'react';
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
    confirmButton: {
      backgroundColor: color,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 8,
      borderRadius: 8,
    },
    confirmText: {
      color: textColor,
      fontWeight: 'bold',
    },
  });
  return (
    <Pressable onPress={pressHandler}>
      <View style={styles.confirmButton}>
        <Text style={styles.confirmText}>{name}</Text>
      </View>
    </Pressable>
  );
};
