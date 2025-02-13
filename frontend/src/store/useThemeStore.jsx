import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    // Initialize theme from localStorage or default to "coffee"
    const [theme, setThemeState] = useState(
      localStorage.getItem("chat-theme") || "coffee"
    );
  
    // Update localStorage and state when theme changes
    const setTheme = (newTheme) => {
      localStorage.setItem("chat-theme", newTheme);
      setThemeState(newTheme);
    };
  
    // Optional: Apply the theme to the document body or root element
    useEffect(() => {
      document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);
  
    return (
      <ThemeContext.Provider value={{ theme, setTheme }}>
        {children}
      </ThemeContext.Provider>
    );
  };