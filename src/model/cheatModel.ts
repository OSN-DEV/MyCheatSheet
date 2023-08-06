export type CheatModel = {
  id: number;
  title: string;
  keys: CheatItemsModel[]
};

export type CheatItemsModel = {
  key: string;
  desc: string;
  note: string;
}
