import { FC, createRef, useCallback, useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { View } from 'react-native';
import Animated, { FadeInRight, FadeOutRight } from 'react-native-reanimated';
import { LIGHT_DEFAULT_COLOR } from '../theme/color';
import { PrimaryButton, SecondaryButton } from './Button';
import { useClickOutside } from 'react-native-click-outside';
import { Portal } from '@gorhom/portal';

export type HeaderRightMenuProps = {
  title: string;
  hideMenu?: () => void;
};

export const HeaderRightMenu: FC<HeaderRightMenuProps> = ({ title }) => {
  const [isShowSubMenu, setIsShowSubMenu] = useState<boolean>(false);
  const toggleSubMenu = useCallback(
    (name = 'xxxx') => {
      setIsShowSubMenu(!isShowSubMenu);
      console.log(name, '------------------------');
    },
    [isShowSubMenu],
  );
  const clickOutSideRef = useClickOutside(toggleSubMenu);

  return (
    <>
      <View>
        <PrimaryButton name="Menu" pressHandler={() => toggleSubMenu('show')} />
      </View>
      <Portal hostName="subMenu">
        {isShowSubMenu && (
          <View style={[MenuStyles.subMenu]}>
            <Animated.View entering={FadeInRight} exiting={FadeOutRight.delay(200)}>
              <SecondaryButton name="Sub menu 1" pressHandler={() => toggleSubMenu('sub menu 1')} />
            </Animated.View>
            <Animated.View entering={FadeInRight.delay(50)} exiting={FadeOutRight.delay(150)}>
              <SecondaryButton name="Sub menu 1" pressHandler={() => toggleSubMenu('sub menu 2')} />
            </Animated.View>
            <Animated.View entering={FadeInRight.delay(100)} exiting={FadeOutRight.delay(100)}>
              <SecondaryButton name="Sub menu 1" pressHandler={() => toggleSubMenu('sub menu 3')} />
            </Animated.View>
            <Animated.View entering={FadeInRight.delay(150)} exiting={FadeOutRight.delay(50)}>
              <SecondaryButton name="Sub menu 1" pressHandler={() => toggleSubMenu('sub menu 4')} />
            </Animated.View>
            <Animated.View entering={FadeInRight.delay(200)} exiting={FadeOutRight}>
              <SecondaryButton name="Sub menu 1" pressHandler={() => toggleSubMenu('sub menu 5')} />
            </Animated.View>
          </View>
        )}
      </Portal>
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
    top: 0,
    right: 8,
    display: 'flex',
    gap: 4,
    marginTop: 4,
    zIndex: 100,
  },
  menuButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: LIGHT_DEFAULT_COLOR.button.primary,
  },
});
