import fs from "fs"
import path from "path"
import Ajv from "ajv"
import { BrowserWindow, app } from "electron"
import { CheatFileModel } from "../model/cheatFileModel";
import { CheatFileSchema, CheatListFileSchema } from "../model/jsonScheme";
import { devLog } from "../util/common";
import { FilePath, ErrorCode } from "../util/constants";
import { dialog } from "electron";
import { CheatModel } from "../model/cheatModel";
import { SettingModel } from "../model/SettingModel";

/***
 * データフォルダを作成する
 */
export const createDataDirectory = () => {
  const filePath = path.join(app.getPath("appData"), FilePath.AppDirectory);  
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(filePath);
  }
}

/***
 * チートファイルのインポート
 * @param owner? {BrowserWindow} オーナーウィンドウ
 * @return {filePath: string, isValid: boolean, isExist: boolean, errors: string[]}
 *          result : 処理結果
 *          cheatFiles : 更新後のチートファイルのリスト
 */
export const importCheatFile = async(owner?: BrowserWindow | null) : Promise<{result: ErrorCode, cheatFiles: CheatFileModel[] }> => {
  devLog(`importCheatFile.showImportExerciseFileDialog`);

  if (null == owner) {
    devLog(`owner is null`);
    return {result: ErrorCode.Unknown, cheatFiles: []};
  }

  // 対象となるファイルの選択
  const { canceled, filePaths } = await dialog.showOpenDialog(owner, {
    title: "select cheat file files",
  });
  if (canceled) {
    devLog('cancel selection');
    return  {result: ErrorCode.Canceled, cheatFiles: []};
  }
  const filePath = filePaths[0];

  const model: CheatModel = JSON.parse(fs.readFileSync(filePath, "utf8"));
  console.dir(model);

  const validator = (new Ajv()).compile(CheatFileSchema);
  if (!validator(model)) {
    console.log(validator.errors);
    return Promise.reject("");
  }

  // IDの有無
  const list = await loadCheatFileList();
  const isExist = list.some((item:CheatFileModel) => item.filePath === filePath);

  if (isExist) {
    return {result: ErrorCode.Exist, cheatFiles: []};
  }

  const newList = [...list, {
    id: new Date().getTime(),
    displayName: path.parse(filePath).name,
    filePath: filePath,
    importedAt: new Date().toLocaleString('sv').replace(/\D/g, ''),
  }];

  saveCheatFileList(newList);

  return {result: ErrorCode.None, cheatFiles: newList};
}

/***
 * チートファイルのリストを保存
 */
export const saveCheatFileList = async(list: CheatFileModel[]) => {
  devLog(`saveCheatFileList`)
  const filePath = path.join(app.getPath("appData"), FilePath.CheatList);  
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
  fs.writeFileSync(filePath, JSON.stringify(list));
}

/***
 * チートファイルのリスト読み込み
 */
export const loadCheatFileList = async() : Promise<CheatFileModel[]> => {
  devLog(`loadCheatFileList`)
  try {
    const filePath = path.join(app.getPath("appData"), FilePath.CheatList);  
    if (!fs.existsSync(filePath)) {
      devLog(`list not found`);
      return [];
    }

    const model: CheatFileModel[] = JSON.parse(fs.readFileSync(filePath, "utf8"))
    const validator = (new Ajv()).compile(CheatListFileSchema);

    if (validator(model)) {
      model.sort((src, dest) => {
        if (src.displayName < dest.displayName)  {
          return -1;
        } else if (src.displayName > dest.displayName) {
          return 1;
        } else {
          return 0;
        }
        
      });
      return model;
    } else {
      console.log(validator.errors)
      return Promise.reject("list.json is invalid");
    }
  } catch(e: unknown) {
    if (e instanceof Error) {
      console.log(e.message);
    } else {
      console.log("unknown error");
    }
    return Promise.reject("exception occurred");
  }
}

/***
 * チートファイルの読み込み
 */
export const loadCheatFile = async(filePath: string) : Promise<CheatModel[] | null> => {
  devLog(`loadCheatFile:${filePath}`)
  try {
    if (!fs.existsSync(filePath)) {
      devLog(`file not found`);
      return null;
    }

    const model: CheatModel[] = JSON.parse(fs.readFileSync(filePath, "utf8"))
    const validator = (new Ajv()).compile(CheatFileSchema);

    if (validator(model)) {
      model.forEach((m,i)=> {m.id = i});
      return model;
    } else {
      console.log(validator.errors)
      return Promise.reject("Cheat file is invalid");
    }
  } catch(e: unknown) {
    if (e instanceof Error) {
      console.log(e.message);
    } else {
      console.log("unknown error");
    }
    return Promise.reject("exception occurred");
  }
}


/***
 * セッティングファイルの読込
 * @param なし
 * @return {SettingModel} 処理結果
 */
export const LoadSettings = async() : Promise<SettingModel> => {
    devLog(`LoadSettings`);
    const filePath = path.join(app.getPath("appData"), FilePath.Settings);  
    let result: SettingModel = { displayName: '', path: ''}

    if (fs.existsSync(filePath)) {
      result = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    return result;
}


/***
 * セッティングファイルの保存
 * @param settings {SettingModel} 設定情報
 */
export const saveSettings = async(settings: SettingModel) => {
  devLog(`saveSettings`)
  const filePath = path.join(app.getPath("appData"), FilePath.Settings);
  devLog(filePath);
  devLog(JSON.stringify(settings));
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
  fs.writeFileSync(filePath, JSON.stringify(settings));
}
