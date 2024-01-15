import { FC, useCallback, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Text, View } from 'react-native';

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
        <View style={[MenuStyles.debug]}>
          <Text numberOfLines={1}>{title}</Text>
        </View>
      </Pressable>
      {isShowSubMenu && (
        <View style={[MenuStyles.subMenu, MenuStyles.debug]}>
          <View>
            <Text numberOfLines={1} style={{ flex: 1, textAlign: 'left' }}>
              Sub Menu
            </Text>
          </View>
        </View>
      )}
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
