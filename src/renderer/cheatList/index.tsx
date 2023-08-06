
import React, { useCallback, useEffect, useState } from "react";
import { faFileCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SearchBar from "../common/searchBar";
import { CheatFileModel, CreateCheatFileModel } from "../../model/cheatFileModel";
import SourceFile from "./sourceFile";
import { config } from "@fortawesome/fontawesome-svg-core";
import { devLog } from "../../util/common";
import EditDialog from "./editDialog";
import { saveCheatFileList } from "../../main/files";
import { ErrorCode } from "../../util/constants";

// https://tech-lab.sios.jp/archives/33280
// https://www.sukerou.com/2022/12/html5dialogreact.html


const CheatList = () => {
devLog(`CheatList`);
  config.autoAddCss = false;

  const [isShow, setIsShow] = useState<Boolean>(false);
  const [currentModel, setCurrentModel] = useState<CheatFileModel>(CreateCheatFileModel())
  const [list, setList] = useState<CheatFileModel[]>([]);
  const [selectedItem, setSelectedItem] = useState<CheatFileModel | null>(null);
  // const [inputVal, setInputVal] = useState<String>("");
  let inputVal = "";

  window.iMain.sendCheatList((_: any, data: any) => {
    const list = JSON.parse(data) as CheatFileModel[];
    setSelectedItem(list.length > 0 ? list[0]: null);
    setList(list);
  });


  const handleImport = async() => {
    devLog(`handleImport`);
    const {result, cheatFiles} = await window.iMain.importCheatFile();
    if (result === ErrorCode.None) {
      setList(cheatFiles);
    }
  }


  const handleEditClick = (id:number) => {
    devLog(`handleEditClick(${id})`);
    const item = list.filter((m) => m.id === id);
    if (item.length > 0) {
      setCurrentModel(item[0]);
    }
    setIsShow(true);
  }


  /**
   * アイテム選択処理
   * @param {string} displayName 表示名
   * @param {string} path ファイルのパス
   */
  const handleSelectClick = (displayName: string, path: string) => {
    devLog(`handleSelectClick(${path})`);
    window.iMain.selectCheatFile(displayName, path);
  }


  const handleDialogCancel = () => {
    devLog(`handleDialogCancel`)
    setIsShow(false);
  }


  const handleDialogSave = async (id: Number, displayName: string) => {
    devLog(`handleDialogSave : ${displayName}`)
    const newList = list.map((m:CheatFileModel) => {
      if (m.id === id) {
        return {...m, displayName: displayName};
      } else {
        return m;
      }
    }) as CheatFileModel[];

    console.log(JSON.stringify(newList));
    window.iMain.saveCheatFiles(newList);
    setList(newList);
  }
 

  const handleDeleteClick = (id: number) => {
    devLog(`handleDeleteClick(${id})`);
    const newList = list.filter((item) => item.id !== id);
    window.iMain.saveCheatFiles(newList);
    setList(newList);
  }


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        if (list.length === 0) {
          return;
        }
        console.log('Arrow up/down');
        const currentIndex = list.findIndex((m) => m === selectedItem);
        let newIndex = currentIndex + (e.key === 'ArrowUp' ? -1 : 1);
        if (newIndex < 0) {
          newIndex = list.length - 1;
        } else if (newIndex >= list.length) {
          newIndex = 0;
        };
        setSelectedItem(list[newIndex]);
      } else if (e.key === 'Enter') {
        if (selectedItem) {
          handleSelectClick(selectedItem.displayName, selectedItem.filePath);
        }
        console.log('enter');
      } else if (e.ctrlKey && e.key === 'w' || e.key === 'Escape') {
        window.iMain.closeCheatList();
      } else if ('0' <= e.key && e.key <= '9') {
        inputVal = inputVal + e.key;
        if (2 === inputVal.length) {
          const index = parseInt(inputVal);
          if (index < list.length) {
            inputVal="";
            setSelectedItem(list[index]);
          }
        }
      } else if (e.ctrlKey && e.key === 'Home') {
        setSelectedItem(list[0]);
      } else if (e.ctrlKey && e.key === 'End') {
        setSelectedItem(list[list.length -1]);
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    }
  },[list, selectedItem]);
devLog("hoge");
  return (
    <>
      <div className="mt-4"></div>
      {/* <SearchBar /> */}
      <ul>
      {list.map((m, i) => {
        return <SourceFile
                  isSelected={m === selectedItem}
                  index={i}
                  key={`source-file-${i}`}
                  handleEditClick={handleEditClick}
                  handleDeleteClick={handleDeleteClick}
                  handleSelectClick={handleSelectClick}
                  file={m} />
      })}
      </ul>

      <EditDialog
        id={currentModel.id}
        isShow = {isShow}
        displayName = {currentModel.displayName}
        onClose= {handleDialogCancel}
        onSave={handleDialogSave}
        />
        
      <button tabIndex={-1} className="add-btn search-btn" onClick={handleImport}>
      <FontAwesomeIcon icon={faFileCirclePlus} />
      </button>
    </>
  );
};

export default CheatList;
