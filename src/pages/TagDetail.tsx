import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FC, useCallback, useContext, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { RootStackParamList } from '../types/Router';
import { ETag } from '../entities/ETag';
import { globalContext } from '../context/globalContext';
import AddIcon from '../images/Add.svg';
import { EItem } from '../entities/EItem';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    padding: 8,
    display: 'flex',
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
  contentWrapper: {
    marginTop: 12,
    flex: 1,
  },
  bottomContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export const TagDetail: FC<NativeStackScreenProps<RootStackParamList, 'TagDetail'>> = ({
  route,
  navigation,
}) => {
  const {
    params: { id },
  } = route;
  const { dbConn } = useContext(globalContext);
  const [tag, setTag] = useState<ETag | null>(null);

  const toAddItem = useCallback(() => {
    if (!tag) {
      return;
    }
    navigation.navigate('AddItem', { tagId: tag.tagId });
  }, [navigation, tag]);

  const refresh = useCallback(() => {
    dbConn
      ?.getRepository(ETag)
      .findOne({ relations: { items: true }, where: { tagId: id } })
      .then((res) => {
        if (!res) {
          return;
        }
        setTag(res);
      });
  }, [dbConn, id]);

  useEffect(() => {
    navigation.addListener('focus', refresh);
    refresh();
    return () => navigation.removeListener('focus', refresh);
  }, [refresh, navigation]);

  return (
    <>
      {tag ? (
        <View style={styles.container}>
          {/* <Text>{tag.tagId}</Text> */}
          <Text style={styles.title}>{tag.name}</Text>
          <Text style={styles.description}>{tag.desc}</Text>
          <View style={styles.contentWrapper}>
            {tag.items.map((i) => (
              <TagItem key={i.id} item={i} />
            ))}
          </View>
          <View style={styles.bottomContainer}>
            <Pressable onPress={toAddItem}>
              <AddIcon width={40} height={40} color="#3399CC" />
            </Pressable>
          </View>
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

const TagItem: FC<{ item: EItem }> = ({ item: { alias, desc } }) => {
  return (
    <View style={tagItemStyles.container}>
      <Text style={tagItemStyles.cell}>{alias}</Text>
      <Text numberOfLines={1} style={[tagItemStyles.cell, tagItemStyles.value]}>
        {desc}
      </Text>
    </View>
  );
};
