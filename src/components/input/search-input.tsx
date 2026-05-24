import React, { useState } from "react";

const SearchInput = ({ placeholder }: { placeholder: string }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="w-full max-w-xl px-0">
      <div className="relative flex items-center w-full">
        <div className="absolute left-4 text-black">
          <img src="/icons/search.svg" />
        </div>
        <input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={handleSearch}
          className="w-full h-12 pl-10 pr-4 bg-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-tredi-lime text-[gray]"
        />
      </div>
    </div>
  );
};

export default SearchInput;
