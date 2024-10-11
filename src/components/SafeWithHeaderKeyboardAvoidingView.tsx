import { useHeaderHeight } from '@react-navigation/elements';
import { FC, PropsWithChildren } from 'react';
import { KeyboardAvoidingView, SafeAreaView, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  root: {
    height: '100%',
  },
});

export const SafeWithHeaderKeyboardAvoidingView: FC<PropsWithChildren> = ({ children }) => {
  const headerHeight = useHeaderHeight();
  console.log(headerHeight, '============');

  return (
    <SafeAreaView style={[styles.root]}>
      <KeyboardAvoidingView style={styles.root} behavior="padding">
        {children}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
