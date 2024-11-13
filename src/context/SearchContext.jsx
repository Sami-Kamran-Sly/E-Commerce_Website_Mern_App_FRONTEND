import { createContext, useContext, useEffect, useState } from "react";

// remember that when you created an e commerce website with front you cant
//  searched  of what you want to search because of filters 
// if i select men and want to search laptops it
//  wont show any thing to me remember
const SearchAuthContext = createContext();

export const useSearchContext = () => useContext(SearchAuthContext);

function SearchContext({ children }) {
const [auth,setAuth] = useState({
    keyword:"",
    results:[]
    
})

  return (
    <SearchAuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </SearchAuthContext.Provider>
  );
}

export default SearchContext;
