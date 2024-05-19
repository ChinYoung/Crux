import { FC } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { EGroup } from '../entities/EGroup';
import { PredefinedColorList } from '../lib/Constants';

export type TCapsuleProps = {
  group: EGroup;
  toDetail: () => void;
};

export const Capsule: FC<TCapsuleProps> = ({ group, toDetail }) => {
  const color =
    [PredefinedColorList.dark, PredefinedColorList.light]
      .flat()
      .find((c) => c.id === group.backgroundColor) || PredefinedColorList.dark[0];
  const dynamicStyles = StyleSheet.create({
    container: {
      backgroundColor: color?.backgroundColor,
    },
  });
  return (
    <Pressable onPress={toDetail}>
      <View style={[styles.container, dynamicStyles.container]}>
        <Text style={styles.name}>{group.name}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#333399',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexShrink: 0,
  },
  name: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  listContainer: {
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    paddingVertical: 2,
    paddingHorizontal: 4,
    gap: 4,
  },
  formContainer: {},
  inputs: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'blue',
  },
});
