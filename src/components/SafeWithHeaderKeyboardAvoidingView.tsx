import { useHeaderHeight } from '@react-navigation/elements';
import { FC, PropsWithChildren } from 'react';
import { KeyboardAvoidingView, SafeAreaView, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  root: {
    height: '100%',
    overflow: 'scroll',
    paddingBottom: 20,
  },
});

export const SafeWithHeaderKeyboardAvoidingView: FC<PropsWithChildren> = ({ children }) => {
  const headerHeight = useHeaderHeight();
  console.log(headerHeight, '============');

  // TODO: accumulate header height

  return (
    <SafeAreaView style={[styles.root]}>
      <KeyboardAvoidingView
        style={styles.root}
        behavior="padding"
        keyboardVerticalOffset={headerHeight}
      >
        {children}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
