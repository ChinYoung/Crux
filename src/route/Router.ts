export type RootStackParamList = {
  Home: undefined;
  AddGroup: undefined;
  AddItem: { tagId: string; tagName: string };
  GroupDetail: { id: string };
  AccountDetail: { accountId: string; name: string };
};
