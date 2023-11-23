import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FC, useCallback, useContext, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { RootStackParamList } from '../route/Router';
import { EGroup } from '../entities/EGroup';
import { globalContext } from '../context/globalContext';
import { EItem } from '../entities/EItem';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    padding: 8,
    display: 'flex',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  description: {
    opacity: 0.6,
    paddingLeft: 4,
    fontSize: 12,
  },
  divider: {
    width: '100%',
    borderColor: '#ccc',
    borderStyle: 'solid',
    borderBottomWidth: 1,
    marginTop: 8,
  },
  contentWrapper: {
    marginTop: 12,
    flex: 1,
  },
  addButton: {
    width: '100%',
    paddingVertical: 4,
    backgroundColor: '#0099CC',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    marginTop: 4,
  },
  addButtonText: {
    color: '#fff',
  },
  bottomContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export const GroupDetail: FC<NativeStackScreenProps<RootStackParamList, 'GroupDetail'>> = ({
  route,
  navigation,
}) => {
  const {
    params: { id },
  } = route;
  const { dbConn } = useContext(globalContext);
  const [tag, setTag] = useState<EGroup | null>(null);

  const toAddItem = useCallback(() => {
    if (!tag) {
      return;
    }
    navigation.navigate('AddItem', { tagId: tag.tagId, tagName: tag.name });
  }, [navigation, tag]);

  const refresh = useCallback(() => {
    dbConn
      ?.getRepository(EGroup)
      .findOne({ relations: { items: true }, where: { tagId: id } })
      .then((res) => {
        if (!res) {
          return;
        }
        setTag(res);
      });
  }, [dbConn, id]);

  const navToItemDetail = useCallback(
    (itemId: string, alias: string) => {
      navigation.navigate('ItemDetail', { itemId, alias });
    },
    [navigation],
  );

  useEffect(() => {
    navigation.addListener('focus', refresh);
    refresh();
    return () => navigation.removeListener('focus', refresh);
  }, [refresh, navigation]);

  useEffect(() => {
    navigation.setOptions({
      title: tag?.name,
    });
  }, [navigation, tag?.name]);

  return (
    <>
      {tag ? (
        <View style={styles.container}>
          {/* <Text>{tag.tagId}</Text> */}
          {/* <Text style={styles.title}>{tag.name}</Text> */}
          <Text style={styles.description}>{tag.desc}</Text>
          <View style={styles.divider} />
          <View style={styles.contentWrapper}>
            {tag.items.map((i) => (
              <TagItem key={i.id} item={i} navToItemDetail={navToItemDetail} />
            ))}
          </View>
          <Pressable onPress={toAddItem} style={styles.addButton}>
            <Text style={styles.addButtonText}>Add</Text>
            {/* <AddIcon width={40} height={40} color="#3399CC" /> */}
          </Pressable>
          {/* <View style={styles.bottomContainer}>
          </View> */}
        </View>
      ) : null}
    </>
  );
};

const tagItemStyles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 6,
    // backgroundColor: '#aaa',
    padding: 2,
    gap: 4,
  },
  cell: {
    padding: 4,
    backgroundColor: '#fff',
    borderRadius: 4,
    overflow: 'hidden',
  },
  value: {
    flex: 1,
  },
});

const TagItem: FC<{ item: EItem; navToItemDetail: (itemId: string, alias: string) => void }> = ({
  item: { alias, desc, itemId },
  navToItemDetail,
}) => {
  return (
    <Pressable onPress={() => navToItemDetail(itemId, alias)}>
      <View style={tagItemStyles.container}>
        <Text style={tagItemStyles.cell}>{alias}</Text>
        <Text numberOfLines={1} style={[tagItemStyles.cell, tagItemStyles.value]}>
          {desc}
        </Text>
      </View>
    </Pressable>
  );
};
