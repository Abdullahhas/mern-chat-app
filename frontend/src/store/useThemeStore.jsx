import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
   
    const [theme, setThemeState] = useState(
      localStorage.getItem("chat-theme") || "coffee"
    );
  
   
    const setTheme = (newTheme) => {
      localStorage.setItem("chat-theme", newTheme);
      setThemeState(newTheme);
    };
  
    
    useEffect(() => {
      document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);
  
    return (
      <ThemeContext.Provider value={{ theme, setTheme }}>
        {children}
      </ThemeContext.Provider>
    );
  };