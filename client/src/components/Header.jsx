import { toggleSidebar } from "../util/utils";
import SearchBar from "./SearchBar";


function Header() {

  return (
    <header className="sticky top-0 bg-white border-b border-b-slate-200 px-5 py-4">

      <div className="flex gap-3 items-center justify-between">

        <SearchBar />

        <button onClick={toggleSidebar} className="text-gray-900 text-2xl font-bold small-screen:block hidden">
          <i className="bi bi-list"></i>
          <span className="sr-only">Toggle sidebar</span>
        </button>

      </div>
    </header>
  )
}

export default Header;