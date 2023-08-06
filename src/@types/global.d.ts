import { CheatFileModel } from "../model/cheatFileModel";
import { CheatModel } from "../model/cheatModel";
import { ErrorCode } from "../util/constants";

declare global {
  interface Window {
    iMain: IMain;
  }
}

export interface IMain {
  importCheatFile: () => Promise<{result: ErrorCode, cheatFiles: CheatFileModel[] }>
  getCheatFiles: () => Promise<CheatFileModel[]>
  getCheatFile: (id: number) => Promise<CheatModel[]>
  showCheatList: () => void
  closeCheatList: () => void
  saveCheatFiles: (list: CheatFileModel[]) => void
  selectCheatFile: (displayName: string, path: string) => void
  sendCheatList: (listener: (event: any, data: any) => void) => void
  sendCheatData: (listener: (event: any, displayName:any, data: any) => void) => void
  removeSendCheatData: () => void
}
