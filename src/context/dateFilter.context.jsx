// context/MyContext.js
import { createContext, useState } from "react";

export const DateFilterContext = createContext();

// eslint-disable-next-line react/prop-types
export const DateFilterProvide = ({ children }) => {
  const [state, setState] = useState(null);

  return (
    <DateFilterContext.Provider value={{ state, setState }}>
      {children}
    </DateFilterContext.Provider>
  );
};
