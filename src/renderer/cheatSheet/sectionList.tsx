import React from 'react';
import { SectionListModel } from '../../model/sectionListModel';
import { Link as Scroll } from 'react-scroll'

type SectionListProps = {
  list: SectionListModel[];
}

const SectionList = (props: SectionListProps) => {
  // config.autoAddCss = false;
  const {list} = props;
  return (
    <div className="flex-none w-120 bg-slate-300 px-3 py-2 fixed z-20">
      <ul>
      {list.map((m,i) => createListItem(m,i))}
      </ul>
    </div>
  );
}

const createListItem = (data: SectionListModel, index: number):JSX.Element => {
  return (
    <li key={`section-list-${index}`} className="mt-3 cursor-pointer hover:underline" >
      <Scroll to={`link-${data.id}`} smooth={true} duration={300}>
      <span className="file-index">{('00'+index).slice(-2)}</span>{'　'.repeat(data.level - 1)}{data.name}
      </Scroll>
    </li>
  )
}

export default SectionList;

