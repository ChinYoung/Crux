export type RootStackParamList = {
  Home: undefined;
  AddGroup: undefined;
  AddItem: { tagId: string; tagName: string };
  GroupDetail: { id: string };
  ItemDetail: { itemId: string; alias: string };
};
