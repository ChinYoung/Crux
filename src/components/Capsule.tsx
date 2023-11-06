import { FC } from 'react';
import { Pressable, Text, View } from 'react-native';

export type TCapsuleProps = {
  name: string;
  toDetail: () => void;
};
export const Capsule: FC<TCapsuleProps> = ({ name, toDetail }) => {
  return (
    <Pressable onPress={toDetail}>
      <View>
        <Text>{name}</Text>
      </View>
    </Pressable>
  );
};
