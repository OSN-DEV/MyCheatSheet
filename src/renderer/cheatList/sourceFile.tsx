import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { CheatFileModel } from "../../model/cheatFileModel";
import { config } from "@fortawesome/fontawesome-svg-core";

type SourceFileProps = {
  index: number,
  isSelected: boolean,
  file: CheatFileModel,
  handleEditClick:(id: number) => void,
  handleDeleteClick:(id: number) => void
  handleSelectClick:(displayName: string, path: string) => void
};
const SourceFile = (props: SourceFileProps) => {
  config.autoAddCss = false;
  const { index, isSelected, file, handleEditClick, handleDeleteClick, handleSelectClick } = props;

  
    const liClass ='cheat-file-list ' + (isSelected ? 'selected': 'not-selected')
  console.log(liClass)
  return (
    <li {...(index === 0 ? {autoFocus:true}:{})} 
      // className={isselected ? 'selected': 'not-selected'}
      className={liClass}
      onDoubleClick={() => handleSelectClick(file.displayName, file.filePath)}>
      <div className="flex-auto ml-t cursor-pointer">
      <span className="file-index">{('00' + index).slice(-2)}</span>
      {file.displayName}
      </div>
      <div className="">
        <button tabIndex={-1} className="search-btn" onClick={() => handleEditClick(file.id)}>
          <FontAwesomeIcon icon={faPenToSquare} />
        </button>
      </div>
      <div className="mx-5">
        <button tabIndex={-1} className="search-btn" onClick={() => handleDeleteClick(file.id)}>
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
      </li>
    // </div>
  );
};

export default SourceFile;
