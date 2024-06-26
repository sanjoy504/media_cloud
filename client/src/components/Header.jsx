import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { toggleSidebar } from "../util/utils";

export default function Header() {

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-b-slate-200 px-5 py-4">

      <div className="flex gap-3 items-center justify-between">

        <button onClick={toggleSidebar} className="text-gray-900 text-2xl font-bold small-screen:block hidden">
          <i className="bi bi-list"></i>
          <span className="sr-only">Toggle sidebar</span>
        </button>
        <SearchBar />
      </div>
    </header>
  )
};

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

function SearchBar() {

  const inputRef = useRef(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Getting Search Query Value From Url search params
  const initialSearchQuery = searchParams.get('q') || "";
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);

  // Debounced search query
  const debouncedSearchQuery = useDebounce(searchQuery, 800);

  // check page is search page or not
  const isSearchPage = (pathname === "/search" || pathname === "/search/");

  useEffect(() => {
    if (debouncedSearchQuery !== "") {
      if (isSearchPage) {
        setSearchParams({ q: debouncedSearchQuery }, { replace: true });
      } else {
        navigate(`/search?q=${debouncedSearchQuery}`);
      }
    } else if (isSearchPage && initialSearchQuery !== '') {
      navigate(-1);
    };
  }, [debouncedSearchQuery]);

  // clean search bar if user leave search page
  useEffect(() => {
    if (!isSearchPage) {
      setSearchQuery('');
    }
  }, [isSearchPage])

  const handleSearch = (event) => {
    const userSearchText = event.target.value?.replace(/ +/g, ' ').trimStart();
    if (userSearchText !== ' ') {
      setSearchQuery(userSearchText);
    }

  };

  return (
    <div className="small-screen:w-full w-auto h-auto flex justify-center px-3">
      <div className="sticky top-0 w-full">
        <div className="relative">
          <label htmlFor="Search" className="sr-only"> Search </label>
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search folders photos and files"
            className="small-screen:w-full w-96 small-screen:text-xs text-base rounded-md border border-gray-200 py-2.5 px-4 shadow-sm sm:text-xs outline-none focus:border-blue-500"
          />
          <span className="absolute inset-y-0 end-0 grid w-10 place-content-center border-l">
            <button
              type="button"
              className="text-gray-600 hover:text-gray-700"
            >
              <span className="sr-only">Search</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </button>
          </span>
        </div>
      </div>
    </div>
  );
}
