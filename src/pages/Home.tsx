import React, { FC, useCallback, useContext, useEffect, useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, View } from 'react-native';
import { globalContext } from '../context/globalContext';
import { Capsule } from '../components/Capsule';
import AddIcon from '../images/Add.svg';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../route/Router';
import { EGroup } from '../entities/EGroup';

const styles = StyleSheet.create({
  debug: {
    borderColor: 'blue',
    borderStyle: 'solid',
    borderWidth: 1,
  },
  root: {
    display: 'flex',
    position: 'relative',
    width: '100%',
    height: '100%',
    padding: 8,
    justifyContent: 'space-between',
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
  },
});

export const Home: FC<NativeStackScreenProps<RootStackParamList, 'Home'>> = ({ navigation }) => {
  const [allTag, setAllTag] = useState<EGroup[]>([]);
  const { dbConn } = useContext(globalContext);
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

  useEffect(() => {
    navigation.addListener('focus', refresh);
    refresh();
    return () => navigation.removeListener('focus', refresh);
  }, [refresh, navigation]);

  return (
    <SafeAreaView>
      <View style={styles.root}>
        <View style={styles.container}>
          <View style={styles.contentWrapper}>
            {allTag.map((_i) => (
              <Capsule name={_i.name} key={_i.id} toDetail={() => toTagDetail(_i.tagId)} />
            ))}
          </View>
        </View>
        <View style={styles.footer}>
          <Pressable onPress={toAddPage}>
            <AddIcon width={40} height={40} color="#333399" />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};
