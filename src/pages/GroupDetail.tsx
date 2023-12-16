import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FC, useCallback, useContext, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { RootStackParamList } from '../route/Router';
import { EGroup } from '../entities/EGroup';
import { globalContext } from '../context/globalContext';
import { EAccount } from '../entities/EAccount';
import { PrimaryButton } from '../components/Button';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    padding: 4,
    paddingBottom: 6,
    display: 'flex',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  description: {
    paddingLeft: 4,
    fontSize: 14,
  },
  descriptionContent: {
    opacity: 0.6,
    padding: 4,
    fontSize: 10,
    color: '#005485',
  },
  divider: {
    width: '100%',
    borderColor: '#ccc',
    borderStyle: 'solid',
    borderBottomWidth: 1,
    marginTop: 8,
  },
  contentWrapper: {
    borderRadius: 10,
    padding: 8,
    display: 'flex',
    gap: 4,
    flex: 1,
    backgroundColor: '#fdfbe4',
    marginBottom: 8,
  },
  addButton: {
    width: '100%',
    paddingVertical: 6,
    backgroundColor: '#333399',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 4,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
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
      .findOne({ relations: { accountList: true }, where: { tagId: id } })
      .then((res) => {
        console.log('🚀 ~ file: GroupDetail.tsx:85 ~ .then ~ res:', res);
        if (!res) {
          return;
        }
        setTag(res);
      });
  }, [dbConn, id]);

  const toAccountDetail = useCallback(
    (accountId: string, name: string) => {
      navigation.navigate('AccountDetail', { accountId, name });
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
          <Text style={styles.descriptionContent}>{tag.desc}</Text>
          {/* <View style={styles.divider} /> */}
          <View style={styles.contentWrapper}>
            {tag.accountList.map((i) => (
              <AccountItem key={i.id} account={i} toAccountDetail={toAccountDetail} />
            ))}
          </View>
          <PrimaryButton pressHandler={toAddItem} name="Add" />
          {/* <View style={styles.bottomContainer}>
          </View> */}
        </View>
      ) : null}
    </>
  );
};

const AccountStyles = StyleSheet.create({
  container: {
    display: 'flex',
    borderRadius: 6,
    backgroundColor: '#e5c185',
    padding: 8,
    gap: 4,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#005485',
  },
  account: {
    opacity: 0.5,
    fontSize: 10,
    color: '#005485',
  },
});

const AccountItem: FC<{
  account: EAccount;
  toAccountDetail: (itemId: string, name: string) => void;
}> = ({ account: { account, name, accountId }, toAccountDetail }) => {
  return (
    <Pressable onPress={() => toAccountDetail(accountId, name)}>
      <View style={AccountStyles.container}>
        <Text style={AccountStyles.name}>{name}</Text>
        <Text numberOfLines={1} style={[AccountStyles.account]}>
          {account}
        </Text>
      </View>
    </Pressable>
  );
};
