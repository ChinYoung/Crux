import { FC, useCallback } from 'react';
import { Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export const RnImagePicker: FC = () => {
  const pickImage = useCallback(async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });
  }, []);
  return <Button title="Pick An Image" onPress={pickImage} />;
};
