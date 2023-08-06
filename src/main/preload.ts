import  { contextBridge, ipcRenderer, IpcRendererEvent  } from 'electron'
import { CheatFileModel } from '../model/cheatFileModel'
import { EventDef } from '../util/constants'

contextBridge.exposeInMainWorld('iMain', {
  sendCheatList: (listener: (ev: IpcRendererEvent, data: any) => void) => {
    ipcRenderer.on(EventDef.SendCheatList, (ev:IpcRendererEvent, data: any) => listener(ev, data))
  },
  sendCheatData: (listener: (ev: IpcRendererEvent, displayName: any, data: any) => void) => {
    ipcRenderer.on(EventDef.SendCheatData, (ev:IpcRendererEvent, displayName: any, data: any) => listener(ev, displayName, data))
  },
  importCheatFile: () => ipcRenderer.invoke(EventDef.ImportCheatFile),
  getCheatFiles: () => ipcRenderer.invoke(EventDef.GetCheatFiles),
  showCheatList: () => ipcRenderer.invoke(EventDef.ShowCheatList),
  closeCheatList: () => ipcRenderer.invoke(EventDef.CloseCheatList),
  getCheatFile: (id: number) => ipcRenderer.invoke(EventDef.GetCheatFile),
  saveCheatFiles: (list: CheatFileModel[]) => ipcRenderer.invoke(EventDef.SaveCheatFiles, list),
  selectCheatFile: (displayName: string, path: string) => ipcRenderer.invoke(EventDef.SelectCheatFile, displayName, path),
})
