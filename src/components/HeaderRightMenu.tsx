import { FC, useCallback, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Text, View } from 'react-native';
import Animated, { FadeInRight, FadeOutRight } from 'react-native-reanimated';

export type HeaderRightMenuProps = {
  title: string;
};

export const HeaderRightMenu: FC<HeaderRightMenuProps> = ({ title }) => {
  const [isShowSubMenu, setIsShowSubMenu] = useState<boolean>(false);

  const toggleSubMenu = useCallback(() => {
    setIsShowSubMenu(!isShowSubMenu);
  }, [isShowSubMenu]);
  return (
    <>
      <Pressable onPress={toggleSubMenu}>
        <View>
          <Text numberOfLines={1}>{title}</Text>
        </View>
      </Pressable>
      <View style={[MenuStyles.subMenu]}>
        {isShowSubMenu && (
          <Animated.View entering={FadeInRight} exiting={FadeOutRight}>
            <Text numberOfLines={1} style={{ flex: 1, textAlign: 'left' }}>
              Sub Menu 1
            </Text>
          </Animated.View>
        )}
        {isShowSubMenu && (
          <Animated.View entering={FadeInRight} exiting={FadeOutRight}>
            <Text numberOfLines={1} style={{ flex: 1, textAlign: 'left' }}>
              Sub Menu 2
            </Text>
          </Animated.View>
        )}
        {isShowSubMenu && (
          <Animated.View entering={FadeInRight} exiting={FadeOutRight}>
            <Text numberOfLines={1} style={{ flex: 1, textAlign: 'left' }}>
              Sub Menu 3
            </Text>
          </Animated.View>
        )}
        {isShowSubMenu && (
          <Animated.View entering={FadeInRight} exiting={FadeOutRight}>
            <Text numberOfLines={1} style={{ flex: 1, textAlign: 'left' }}>
              Sub Menu 4
            </Text>
          </Animated.View>
        )}
        {isShowSubMenu && (
          <Animated.View entering={FadeInRight} exiting={FadeOutRight}>
            <Text numberOfLines={1} style={{ flex: 1, textAlign: 'left' }}>
              Sub Menu 5
            </Text>
          </Animated.View>
        )}
      </View>
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
