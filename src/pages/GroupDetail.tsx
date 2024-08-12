import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FC, useCallback, useContext, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { RootStackParamList } from '../route/Router';
import { EGroup } from '../entities/EGroup';
import { globalContext } from '../context/globalContext';
import { EAccount } from '../entities/EAccount';
import { PrimaryButton } from '../components/Button';
import { HeaderRightMenu } from '../components/HeaderRightMenu';
import { PortalHost } from '@gorhom/portal';
import { SafeWithHeaderKeyboardAvoidingView } from '../components/SafeWithHeaderKeyboardAvoidingView';

export const GroupDetail: FC<NativeStackScreenProps<RootStackParamList, 'GroupDetail'>> = ({
  route,
  navigation,
}) => {
  const {
    params: { id },
  } = route;
  const { dbConn } = useContext(globalContext);
  const [group, setGroup] = useState<EGroup | null>(null);

  const toAddItem = useCallback(() => {
    if (!group) {
      return;
    }
    navigation.navigate('AddItem', { groupId: group.groupId, name: group.name });
  }, [navigation, group]);

  const refresh = useCallback(() => {
    dbConn
      ?.getRepository(EGroup)
      .findOne({ relations: { accountList: true }, where: { groupId: id } })
      .then((res) => {
        console.log('🚀 ~ file: GroupDetail.tsx:85 ~ .then ~ res:', res);
        if (!res) {
          return;
        }
        setGroup(res);
      });
  }, [dbConn, id]);

  const toAccountDetail = useCallback(
    (accountId: string, name: string) => {
      navigation.navigate('AccountDetail', { accountId, name });
    },
    [navigation],
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight() {
        return (
          <HeaderRightMenu
            title="Menux"
            menuItems={[
              {
                id: '1',
                name: 'sub menu 1',
                handler: () => console.log('sub menu 1'),
              },
              {
                id: '2',
                name: 'sub menu 2',
                handler: () => console.log('sub menu 2'),
              },
              {
                id: '3',
                name: 'sub menu 3',
                handler: () => console.log('sub menu 3'),
              },
            ]}
          />
        );
      },
    });
    navigation.addListener('focus', refresh);
    refresh();
    return () => navigation.removeListener('focus', refresh);
  }, [refresh, navigation]);

  useEffect(() => {
    navigation.setOptions({
      title: group?.name,
    });
  }, [navigation, group?.name]);

  console.log();

  return (
    <>
      {group ? (
        <SafeWithHeaderKeyboardAvoidingView>
          <View style={[styles.container]}>
            <PortalHost name="subMenu" />
            {/* <Text>{tag.tagId}</Text> */}
            {/* <Text style={styles.title}>{tag.name}</Text> */}
            <Text style={styles.descriptionContent}>{group.desc}</Text>
            {/* <View style={styles.divider} /> */}
            <View style={styles.contentWrapper}>
              {group.accountList.map((i) => (
                <AccountItem key={i.id} account={i} toAccountDetail={toAccountDetail} />
              ))}
            </View>
            <PrimaryButton pressHandler={toAddItem} name="Create" />
            {/* <View style={styles.bottomContainer}>
          </View> */}
          </View>
        </SafeWithHeaderKeyboardAvoidingView>
      ) : null}
    </>
  );
};

const AccountItem: FC<{
  account: EAccount;
  toAccountDetail: (itemId: string, name: string) => void;
}> = ({ account: { name, accountId }, toAccountDetail }) => {
  return (
    <Pressable onPress={() => toAccountDetail(accountId, name)}>
      <View style={AccountStyles.container}>
        <Text style={AccountStyles.name}>{name}</Text>
        <Text numberOfLines={1} style={[AccountStyles.account]}>
          {name}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    height: '100%',
    paddingHorizontal: 16,
    paddingBottom: 16,
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
