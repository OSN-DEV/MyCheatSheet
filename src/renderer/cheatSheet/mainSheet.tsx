import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { config } from '@fortawesome/fontawesome-svg-core';
import { CheatItemsModel, CheatModel } from '../../model/cheatModel';
import { warn } from 'node:console';

type MainSheetPops = {
  list: CheatModel[]
}

const MainSheet = (props: MainSheetPops) => {
  config.autoAddCss = false;
  const {list} = props;
  return (
    <div className="flex-auto px-2">
    { list.map((m,i) => createTable(m,i)) }
    </div>
  );
}

const createTable = (data: CheatModel, index: number): JSX.Element => {

  return (
      <div key={`table-${index}`} id={`link-${data.id}`}>
      <h2 className="pt-8 text-2xl">{data.title}</h2>
      <table className="table-fixed w-full">
        <thead>
          <tr className="border-b-2 border-gray-200 bg-gray-100 font-semibold text-gray-700 uppercase tracking-wide"><th>key</th><th>desc</th><th>note</th></tr>
        </thead>
        <tbody>
        {
          data.keys.map((m: CheatItemsModel,i: number) => {
            return(
              <tr key={`tr-${i}`} className="border-b border-secondary-200 bg-secondary-100">
                <td className="w-1/4">{m.key}</td>
                <td className="w-1/4">{m.desc}</td>
                <td className="w-1/2">{m.note}</td>
              </tr>
            );
          })
        }
        </tbody>
      </table>
      </div>
  );
}

export default MainSheet;

