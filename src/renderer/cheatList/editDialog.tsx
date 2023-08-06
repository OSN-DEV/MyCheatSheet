import React, { useState, useRef, useEffect, useCallback } from "react";
import { devLog } from "../../util/common";

type EditDialogProps = {
  id: number,
  isShow : Boolean,
  displayName: string,
  onClose: () => void,
  onSave: (id:Number, name: string) => void
}

const EditDialog = (props: EditDialogProps) => {
devLog(`EditDialog`);
  const { id, isShow, displayName, onClose, onSave } = props;
  const [name, setName] = useState<string>("");
  const dialog = useRef<HTMLDialogElement>(null);


  useEffect(() => {
    if(isShow && !dialog.current?.open) {
      dialog.current?.showModal();
    } else if (!isShow && dialog.current?.open) {
      dialog.current?.close()
    }
    setName(displayName);
  }, [isShow]);

  const handleCancel = useCallback(() => {
    dialog.current?.close()
  },[dialog]);

//   const handleSave = useCallback(() => {
// devLog(`name:${name}, displayName:${displayName}`)
//     if (name !== displayName) {
//       onSave(name);
//     }
//   },[dialog]);
  const handleSave = () => {
    devLog(`name:${name}, displayName:${displayName}`)
    if (name !== displayName) {
      onSave(id, name);
    }
    dialog.current?.close();
  }


  return(
    <>
    <dialog ref={dialog} onClose={onClose ?? (() => {})}>
      <h1 className="text-lg font-semibold text-center 
      text-white bg-orange-500 py-1">Edit Display Name</h1>
      <div className="mx-2 my-3.5">
        <input 
          type="text"
          className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
          value={name} 
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="flex justify-between  mb-3 px-3">
      <button onClick={handleCancel} className="bg-gray-500 hover:bg-gray-400 text-white rounded px-4 py-2">Cancel</button>
      <button onClick={() => handleSave()} className="bg-green-500 hover:bg-green-400 text-white rounded px-4 py-1">Save</button>
      </div>
    </dialog>
    </>
  );
}

export default EditDialog
