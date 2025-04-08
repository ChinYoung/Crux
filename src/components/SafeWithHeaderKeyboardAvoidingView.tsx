import { useHeaderHeight } from '@react-navigation/elements';
import { FC, PropsWithChildren } from 'react';
import { KeyboardAvoidingView,  StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
  root: {
    height: '100%',
  },
});

export const SafeWithHeaderKeyboardAvoidingView: FC<PropsWithChildren> = ({ children }) => {
  const headerHeight = useHeaderHeight();
  console.log(headerHeight, '============');

  return (
    <View style={[styles.root]}>
      <KeyboardAvoidingView style={styles.root} behavior="padding">
        {children}
      </KeyboardAvoidingView>
    </View>
  );
};
