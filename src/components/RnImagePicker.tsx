import { FC, useCallback } from 'react';
import { Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export const RnImagePicker: FC<{ onSelectImage: (uri: ImagePicker.ImagePickerAsset) => void }> = ({
  onSelectImage,
}) => {
  const pickImage = useCallback(async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      const image = result.assets[0];
      onSelectImage(image);
    }
    console.log('🚀 ~ pickImage ~ result:', result);
  }, [onSelectImage]);
  return <Button title="Pick An Image" onPress={pickImage} />;
};
