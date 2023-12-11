import { FC } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export type TCapsuleProps = {
  name: string;
  toDetail: () => void;
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

export const Capsule: FC<TCapsuleProps> = ({ name, toDetail }) => {
  return (
    <Pressable onPress={toDetail}>
      <View style={styles.container}>
        <Text style={styles.name}>{name}</Text>
      </View>
    </Pressable>
  );
};
