import { FC } from 'react';
import { View } from 'react-native';

export const Gap: FC<{ height?: number }> = ({ height = 8 }) => (
  <View style={{ width: '100%', height }} />
);
