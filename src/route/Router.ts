export type RootStackParamList = {
  Home: undefined;
  AddGroup: undefined;
  GroupDetail: { id: string };
  AddItem: { groupId: string; name: string };
  AccountDetail: { accountId: string; name: string };
};
