import { FC, useCallback, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Text, View } from 'react-native';
import Animated, { useSharedValue } from 'react-native-reanimated';

export type HeaderRightMenuProps = {
  title: string;
};

export const HeaderRightMenu: FC<HeaderRightMenuProps> = ({ title }) => {
  const [isShowSubMenu, setIsShowSubMenu] = useState<boolean>(false);
  const opacity = useSharedValue(0);

  const toggleSubMenu = useCallback(() => {
    // setIsShowSubMenu(!isShowSubMenu);
    opacity.value = opacity.value + 0.2;
  }, [opacity]);
  return (
    <>
      <Pressable onPress={toggleSubMenu}>
        <View style={[MenuStyles.debug]}>
          <Text numberOfLines={1}>{title}</Text>
        </View>
      </Pressable>
      <Animated.View style={[{ opacity }, MenuStyles.subMenu, MenuStyles.debug]}>
        <View>
          <Text numberOfLines={1} style={{ flex: 1, textAlign: 'left' }}>
            Sub Menu
          </Text>
        </View>
      </Animated.View>
    </>
  );
};

const MenuStyles = StyleSheet.create({
  debug: {
    borderStyle: 'solid',
    borderColor: 'blue',
    borderWidth: 1,
  },
  subMenu: {
    position: 'absolute',
    top: '100%',
    right: 0,
  },
});
