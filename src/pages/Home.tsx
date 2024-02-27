import React, { FC, useCallback, useContext, useEffect, useState } from 'react';
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
import AddIcon from '../images/Add.svg';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../route/Router';
import { EGroup } from '../entities/EGroup';
import { SafeWithHeaderKeyboardAvoidingView } from '../components/SafeWithHeaderKeyboardAvoidingView';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

export const Home: FC<NativeStackScreenProps<RootStackParamList, 'Home'>> = ({ navigation }) => {
  const { dbConn } = useContext(globalContext);
  const [allTag, setAllTag] = useState<EGroup[]>([]);

  const percent = useSharedValue(0.15);

  const width = useAnimatedStyle(
    () => ({
      width: withDelay(300, withTiming(`${percent.value * 100}%`)),
    }),
    [],
  );

  const refresh = useCallback(async () => {
    const res = await dbConn?.manager.find(EGroup, {
      relations: {
        accountList: true,
      },
    });
    res && setAllTag(res);
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

  const expandSearch = useCallback(() => {
    percent.value = 0.85;
  }, [percent]);
  const foldSearch = useCallback(() => {
    percent.value = 0.15;
  }, [percent]);

  useEffect(() => {
    navigation.addListener('focus', refresh);
    refresh();
    return () => navigation.removeListener('focus', refresh);
  }, [refresh, navigation]);

  return (
    <SafeWithHeaderKeyboardAvoidingView>
      <View style={[styles.root, styles.debug]}>
        {/* content */}
        <Pressable onPress={Keyboard.dismiss} style={[styles.container, styles.debug]}>
          <View style={styles.contentWrapper}>
            {allTag.map((_i) => (
              <Capsule name={_i.name} key={_i.id} toDetail={() => toTagDetail(_i.tagId)} />
            ))}
          </View>
        </Pressable>
        {/* footer */}
        <View style={styles.footer}>
          <Animated.View style={[width, styles.searchInputContainer]}>
            <TextInput
              placeholder="search"
              style={[styles.searchInput]}
              onFocus={expandSearch}
              onBlur={foldSearch}
            />
          </Animated.View>
          <Pressable onPress={toAddPage} style={[styles.createButton]}>
            <Text>Create</Text>
            {/* <Button title="Create" /> */}
            {/* <AddIcon width={40} height={40} color="#333399" /> */}
          </Pressable>
        </View>
      </View>
    </SafeWithHeaderKeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  debug: {
    borderColor: 'blue',
    borderStyle: 'solid',
    borderWidth: 1,
  },
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 10,
    marginTop: 8,
  },
  searchInputContainer: {
    padding: 6,
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 4,
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
});
