import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { config } from "@fortawesome/fontawesome-svg-core";
import SearchBar from "../common/searchBar";

type HeaderPops = {
  title: string;
  showSearchArea: boolean;
  search: (keyword: string) => void;
};

const Header = (props: HeaderPops) => {
  config.autoAddCss = false;
  const { title, search, showSearchArea } = props;
  // const handleSearch = (_: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  //   console.log(`handleSearch`);
  // };

  return (
    <>
      <h1 className="text-4xl py-2 bg-orange-500 text-white text-center font-semibold">{title}</h1>
      {showSearchArea && <SearchBar search={search}/>}
    </>
  );
};

export default Header;
