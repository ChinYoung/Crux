import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { FC } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'black',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.3,
  },
});
export const AddFieldButton: FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <Pressable onPress={onClick}>
      <View style={[styles.container]}>
        <FontAwesomeIcon icon={faPlus} />
      </View>
    </Pressable>
  );
};
