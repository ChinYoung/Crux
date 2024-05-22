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

export const Home: FC<NativeStackScreenProps<RootStackParamList, 'Home'>> = ({ navigation }) => {
  const { dbConn } = useContext(globalContext);
  const [allGroups, setAllGroups] = useState<EGroup[]>([]);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const searchPercent = useSharedValue(0.1);

  const updateExpandedVal = useCallback(() => {
    setIsExpanded(searchPercent.value === 0.7);
  }, [searchPercent]);

  const animatedSearchStyle = useAnimatedStyle(
    () => ({
      flex: withTiming(searchPercent.value, {}, () => {
        runOnJS(updateExpandedVal)();
      }),
      display: 'flex',
    }),
    [],
  );
  const animatedButtonStyle = useAnimatedStyle(
    () => ({
      flex: withTiming(1 - searchPercent.value),
      display: 'flex',
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
    searchPercent.value = 0.7;
    setIsExpanded(true);
  }, [searchPercent]);

  const foldSearch = useCallback(() => {
    searchPercent.value = 0.1;
    // setIsExpanded(false);
  }, [searchPercent]);

  return (
    <SafeWithHeaderKeyboardAvoidingView>
      <View style={[styles.root]}>
        {/* content */}
        <Pressable onPress={Keyboard.dismiss} style={[styles.container]}>
          <View style={styles.contentWrapper}>
            {allGroups.map((_i) => (
              <Capsule group={_i} key={_i.id} toDetail={() => toTagDetail(_i.tagId)} />
            ))}
          </View>
        </Pressable>
        {/* footer */}
        <View style={[styles.footer]}>
          <Animated.View style={[animatedSearchStyle]}>
            <SearchInput onFocus={expandToSearch} onFold={foldSearch} isExpanded={isExpanded} />
          </Animated.View>
          <View style={[styles.filterIcon]}>
            <FontAwesomeIcon icon={faFilter} />
          </View>
          <Animated.View style={[animatedButtonStyle]}>
            <PrimaryButton pressHandler={toAddPage} name="Create" />
          </Animated.View>
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
    flex: 1,
    display: 'flex',
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
    gap: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 10,
    paddingVertical: 8,
    marginTop: 8,
  },
  searchInputContainer: {
    padding: 6,
    borderWidth: 1,
    borderStyle: 'solid',
    display: 'flex',
    height: 40,
  },
  searchInput: {
    flex: 1,
  },
  createButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  filterIcon: {
    borderRadius: 5,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: 'blue',
    display: 'flex',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0.1,
  },
});
