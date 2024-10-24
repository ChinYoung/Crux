import React, { FC, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  Button,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { globalContext } from '../context/globalContext';
import { Capsule } from '../components/Capsule';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../route/Router';
import { EGroup } from '../entities/EGroup';
import { SafeWithHeaderKeyboardAvoidingView } from '../components/SafeWithHeaderKeyboardAvoidingView';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useFrameCallback,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { PrimaryButton } from '../components/Button';
import { SearchInput } from '../components/SearchInput';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { LIGHT_DEFAULT_COLOR } from '../theme/color';
import { GlobalStyles } from '../global/styles';
import { RnImagePicker } from '../components/ImagePicker';

const EXPAND_WIDTH = 160;
const CLAPSED_WIDTH = 40;

export const Home: FC<NativeStackScreenProps<RootStackParamList, 'Home'>> = ({ navigation }) => {
  const { dbConn } = useContext(globalContext);
  const [allGroups, setAllGroups] = useState<EGroup[]>([]);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isSearch, setIsSearch] = useState<boolean>(false);

  const searchInputWidth = useSharedValue(40);

  const updateIsExpanded = useCallback(() => {
    setIsExpanded(searchInputWidth.value === EXPAND_WIDTH);
  }, [searchInputWidth.value]);

  const animatedSearchStyle = useAnimatedStyle(
    () => ({
      width: withTiming(searchInputWidth.value, {}, () => {
        runOnJS(updateIsExpanded)();
      }),
    }),
    [],
  );
  const refresh = useCallback(async () => {
    const res = await dbConn?.manager.find(EGroup, {
      relations: {
        accountList: true,
      },
    });
    res && setAllGroups(res);
  }, [dbConn?.manager]);

  const toAddPage = useCallback(() => {
    navigation.navigate('AddGroup');
  }, [navigation]);

  const toTagDetail = useCallback(
    (id: string) => {
      // TODO: implement this
      navigation.navigate('GroupDetail', { id });
    },
    [navigation],
  );

  useEffect(() => {
    navigation.addListener('focus', refresh);
    refresh();
    return () => navigation.removeListener('focus', refresh);
  }, [refresh, navigation]);

  const expandToSearch = useCallback(() => {
    setIsSearch(true);
    searchInputWidth.value = EXPAND_WIDTH;
  }, [searchInputWidth]);

  const foldSearch = useCallback(() => {
    setIsSearch(false);
    searchInputWidth.value = CLAPSED_WIDTH;
  }, [searchInputWidth]);

  return (
    <SafeWithHeaderKeyboardAvoidingView>
      <View style={[styles.root, GlobalStyles.debug]}>
        <RnImagePicker />
        {/* content */}
        <Pressable onPress={Keyboard.dismiss} style={[styles.container]}>
          <View style={styles.contentWrapper}>
            {allGroups.map((_i) => (
              <Capsule group={_i} key={_i.id} toDetail={() => toTagDetail(_i.groupId)} />
            ))}
          </View>
        </Pressable>
        {/* footer */}
        <View style={[styles.footer]}>
          <Animated.View style={[animatedSearchStyle]}>
            <SearchInput onFocus={expandToSearch} onFold={foldSearch} isSearch={isSearch} />
          </Animated.View>
          <View style={[styles.filterIcon]}>
            <FontAwesomeIcon icon={faFilter} />
          </View>
          <View style={{ flex: 1 }}>
            {isExpanded ? (
              <PrimaryButton pressHandler={toAddPage} name="Search" />
            ) : (
              <PrimaryButton pressHandler={toAddPage} name="Create" />
            )}
          </View>
        </View>
      </View>
    </SafeWithHeaderKeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  root: {
    height: '100%',
    position: 'relative',
    width: '100%',
    padding: 8,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
  },
  container: {
    width: '100%',
    display: 'flex',
    paddingVertical: 8,
    flex: 1,
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  contentWrapper: {
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 8,
  },
  footer: {
    width: '100%',
    left: 0,
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    paddingVertical: 8,
    marginTop: 8,
  },
  searchInputContainer: {
    borderWidth: 1,
    borderStyle: 'solid',
    display: 'flex',
    height: 40,
  },
  filterIcon: {
    borderRadius: 5,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: LIGHT_DEFAULT_COLOR.button.postive,
    display: 'flex',
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
