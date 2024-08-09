import { FC, useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import { View } from 'react-native';
import Animated, { FadeInRight, FadeOutRight } from 'react-native-reanimated';
import { LIGHT_DEFAULT_COLOR } from '../theme/color';
import { PrimaryButton, SecondaryButton } from './Button';
import { useClickOutside } from 'react-native-click-outside';
import { Portal } from '@gorhom/portal';

export type HeaderRightMenuProps = {
  title: string;
  menuItems: MenuConfig[];
  hideMenu?: () => void;
};

export const HeaderRightMenu: FC<HeaderRightMenuProps> = ({ title, menuItems }) => {
  const [isShowSubMenu, setIsShowSubMenu] = useState<boolean>(false);
  const toggleSubMenu = useCallback(() => {
    setIsShowSubMenu(!isShowSubMenu);
  }, [isShowSubMenu]);
  const clickOutSideRef = useClickOutside(() => isShowSubMenu && toggleSubMenu());

  return (
    <View ref={clickOutSideRef}>
      <PrimaryButton name={title} pressHandler={toggleSubMenu} />
      <Portal hostName="subMenu">
        {isShowSubMenu && (
          <View style={[MenuStyles.subMenu]}>
            {menuItems.map(({ id, handler, name }, index) => (
              <Animated.View
                key={id}
                entering={FadeInRight.delay((index + 1) * 50)}
                exiting={FadeOutRight.delay(menuItems.length * 50 - index * 50)}
              >
                <SecondaryButton name={name} pressHandler={handler} />
              </Animated.View>
            ))}
          </View>
        )}
      </Portal>
    </View>
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
