import React, { useState, useEffect } from "react";
import Header from "./header";
import SectionList from "./sectionList";
import MainSheet from "./mainSheet";
import { CheatItemsModel, CheatModel } from "../../model/cheatModel";
import EditDialog from "../cheatList/editDialog";
import { devLog } from "../../util/common";
import { SectionListModel } from "../../model/sectionListModel";
import { scroller } from 'react-scroll'

const CheatSheet = () => {
  const [list, setList] = useState<CheatModel[]>([]);
  const [sectionList, setSectionList] = useState<SectionListModel[]>([]);
  const [filteredList, setFilteredList] = useState<CheatModel[]>([]);
  const [showSecList,setShowSecList] = useState(false);
  const [showSearchArea,setShowSearchArea] = useState(false);
  const [displayName, setDisplayName] = useState("");
  let inputVal = "";

  window.iMain.sendCheatData((ev: any, displayName:any , data: any) => {
    devLog(`sendCheatData : ${displayName}`);
    const cheatList = JSON.parse(data) as CheatModel[];
    setDisplayName(displayName);
    setList(cheatList);
    setFilteredList(cheatList)
    
    const sections:SectionListModel[]  = []
    cheatList.forEach((m) => {
      sections.push({
        id: m.id,
        level: 1,
        name: m.title
      });
    });
    setSectionList(sections);
  });

  useEffect(() => {
    const handleKeyup = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'f') {
        devLog('search');
        setShowSearchArea(p => !p);
        setShowSecList(false);
      } else if (e.ctrlKey && e.key === 's') {
        setShowSecList(p => !p);
        setShowSearchArea(false);
      } else if (e.ctrlKey && e.key === 'l') {
        window.iMain.showCheatList();
        // window.iMain.showCheatList();
      } else if (e.key==='Escape') {
        devLog('esc');
        if (showSecList) {
          setShowSecList(false);
        }
      } else if ('0' <= e.key && e.key <= '9') {
        inputVal = inputVal + e.key;
        if (2 === inputVal.length) {
          const index = parseInt(inputVal);
          if (index < sectionList.length) {
            inputVal="";
            scroller.scrollTo(`link-${sectionList[index].id}`, {smooth:true, duration:300});
          }
        }
      }
    };
    window.addEventListener('keyup', handleKeyup);
    return (() => {
      devLog(`clean up`);
      window.removeEventListener('keyup', handleKeyup);
    });
  },[showSecList]);

  const handleSearch = (keyword: string) => {
    console.log(`handleSearch : ${keyword}`);

    const newList:CheatModel[] = []; 
    list.forEach((c: CheatModel) => {
      const newKeys = c.keys.filter((k:CheatItemsModel) => {
        return (k.key.indexOf(keyword) >=0 || k.desc.indexOf(keyword) >=0 || k.note.indexOf(keyword) >= 0);
      });
      if (0 < newKeys.length) {
        devLog(`new keys JSON.stringify(newKeys)`);
        newList.push({id: c.id, title: c.title, keys: newKeys});
      }
    });
    setFilteredList(newList);
  }

  // 検索処理
  return (
    <>
    <Header 
        title={displayName}
        showSearchArea={showSearchArea}
        search={handleSearch}/>
      <div className="flex">  
        {showSecList && <SectionList 
          list={sectionList}
        /> }
        <MainSheet list={filteredList}/>
      </div>
    </>
  );
}

export default CheatSheet;
