import { Alert } from 'react-native';

export const confirmHof = (fn: () => void, message = 'Confirm to delete?') => {
  return () =>
    Alert.alert('Warning', message, [
      {
        text: 'Cancel',
      },
      {
        text: 'Confirm',
        onPress: () => fn(),
      },
    ]);
};
