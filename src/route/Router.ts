export type RootStackParamList = {
  Home: undefined;
  AddGroup: undefined;
  GroupDetail: { id: string };
  AddAccount: { groupId: string };
  AccountDetail: { accountId: string };
};
