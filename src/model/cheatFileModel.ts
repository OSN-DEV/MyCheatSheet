export type CheatFileModel = {
  id: number;
  displayName: string;
  filePath: string;
}

export const CreateCheatFileModel = (): CheatFileModel => {
  return {
    id: -1,
    displayName: '',
    filePath: ''
  }
}