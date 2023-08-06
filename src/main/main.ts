import path from 'node:path';
import { BrowserWindow, app, ipcMain, dialog, Menu, shell, ipcRenderer } from 'electron';
import { devLog } from '../util/common';
import { EventDef, FilePath } from '../util/constants';
import { createDataDirectory, importCheatFile, loadCheatFile, loadCheatFileList, LoadSettings, saveCheatFileList, saveSettings } from './files';
import { CheatFileModel } from '../model/cheatFileModel';
import { SettingModel } from '../model/SettingModel';
import { CheatModel } from '../model/cheatModel';

// リスナーの削除
// https://zenn.dev/yui/scraps/069f814b498650

let mainWindow: BrowserWindow | null = null;
let cheatListWindow: BrowserWindow | null = null;


const handleImportCheatFile = async() => {
  devLog(`handleImportCheatFile`);
  const {result, cheatFiles} = await importCheatFile(cheatListWindow);

  return {result, cheatFiles}
}

const handleGetCheatFiles = async() => {
  return loadCheatFileList(); 
}

const handleGetCheatFile = async(id: number) => {
  devLog(`handleGetCheatFile:${id}`);
}

const handleSaveCheatFiles = (list: CheatFileModel[]) => {
  devLog(`handleSaveCheatFiles`)
  saveCheatFileList(list);
}

const handleSelectCheatFile = async(displayName: string, path: string) => {
  devLog(`handleSelectCheatFile:${path}`)
  if (cheatListWindow !== null) {
    cheatListWindow.close();
  }
  cheatListWindow = null;
  
  await saveSettings({displayName: displayName, path: path});
  const model = await loadCheatFile(path);
  mainWindow?.webContents.send(EventDef.SendCheatData, displayName, JSON.stringify(model));
  mainWindow?.webContents.removeAllListeners(EventDef.SendCheatData);
  // ipcRenderer.removeAllListeners(EventDef.SendCheatData);
}

class CancelPromiseError extends Error {
  constructor(message:string) {
    super(message);
    this.name="CancelPromiseError";
  }
}


const handleShowCheatList = () => {
  devLog(`handleShowCheatList`);
  showCheatList();
}


const handleCloseCheatList = () => {
  devLog(`handleCloseCheatList`);
  if (cheatListWindow !== null) {
    cheatListWindow.close();
  }
  cheatListWindow = null;
}


function createWindow() {
  mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });


  const menu = Menu.buildFromTemplate([
    {label: "app",
    submenu:[
      {label:'Show Cheat Files',click:() => showCheatList()},
      {type: 'separator'},
      {label:'exit', click:() => closeApp()},
      {label:'test',click:() => handleImportCheatFile()},
      {label:'decrement',click:() => mainWindow?.webContents.send('update-counter',-1)}
    ]},
    {label: "debug",
    submenu:[
      {label:'dev tool',click:() => handleToggleDevTool(), accelerator:'Ctrl+Shift+I'}
    ]

    }
  ])
  Menu.setApplicationMenu(menu)

  let displayName = "";
  mainWindow.loadFile('dist/index.html')
    .then(() => LoadSettings())
    .then((settings: SettingModel) => {
      if (0 < settings.path.length) {
        displayName = settings.displayName;
        return loadCheatFile(settings.path);
      } else {
        throw new CancelPromiseError('ignore error');
      }
    })
    .then((model: CheatModel[] | null) => {
      if (model) {
        mainWindow?.webContents.send(EventDef.SendCheatData, displayName, JSON.stringify(model));
        mainWindow?.webContents.removeAllListeners(EventDef.SendCheatData);
      } else {
        throw new CancelPromiseError('ignore error');
      }
    })
    .catch((error) => {
      if (error instanceof CancelPromiseError) {
        // NOP
      } else {
        console.error(error);
      }
    });

    // if (process.env.NODE_ENV === 'development') {
    //   mainWindow.webContents.openDevTools();
    // }
}

const closeApp = () => {
  app.quit();
}

/**
 * devtoolのトグル
 */
const handleToggleDevTool = () => {
  if (cheatListWindow) {
    cheatListWindow.webContents.toggleDevTools();
  } else {
    mainWindow?.webContents.toggleDevTools();
  }
}

/**
 * チートリストを表示
 */
const showCheatList = () => {
    console.log(process.env.NODE_ENV);

  cheatListWindow = new BrowserWindow({
    parent: mainWindow!,
    modal: true,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  showCheatFilesProc(cheatListWindow);
}

const showCheatFilesProc = async(window: BrowserWindow) => {
  await window.loadFile('dist/cheatlist.html')
  const list = await loadCheatFileList();
  window.webContents.send(EventDef.SendCheatList, JSON.stringify(list));
  window.webContents.removeAllListeners(EventDef.SendCheatList)

  // if (process.env.NODE_ENV === 'development') {
  //   window.webContents.openDevTools();
  // }
  window.setMenuBarVisibility(false);
  window.show();
  window.focus();
}

app.whenReady().then(() => {
  devLog(`app.whenReady`);

  // register event
  ipcMain.handle(EventDef.ImportCheatFile, handleImportCheatFile);
  ipcMain.handle(EventDef.GetCheatFiles, handleGetCheatFiles);
  ipcMain.handle(EventDef.GetCheatFile, (_, id) => handleGetCheatFile(id))
  ipcMain.handle(EventDef.SaveCheatFiles, (_, list) => handleSaveCheatFiles(list))
  ipcMain.handle(EventDef.SelectCheatFile, (_, displayName, path) => handleSelectCheatFile(displayName, path))
  ipcMain.handle(EventDef.ShowCheatList, () => handleShowCheatList());
  ipcMain.handle(EventDef.CloseCheatList, () => handleCloseCheatList());

  createDataDirectory();
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})
