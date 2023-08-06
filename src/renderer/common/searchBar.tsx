import React, { useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

type SearchBarProps = {
  search: (keyword: string) => void;
}

const SearchBar = (props: SearchBarProps) => {
  const {search} = props;
  const [text, setText] = useState("")

  return (
    <>
      <div>
        <input
          className="m-3 border-b focus:outline-none focus:border-b-2 focus:border-indigo-500 placeholder-gray-500 placeholder-opacity-50"
          placeholder="keyword"
          autoFocus
          type="text"
          id="keyword"
          value={text}
          onChange=
            {(event) =>{
              setText(event?.target.value);
              search(event?.target.value);
            }}
        />
        <button className="search-btn">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
      </div>
    </>
  );
};

export default SearchBar;
