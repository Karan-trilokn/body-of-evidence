import React, { createContext, useState, useEffect, useContext } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
   const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("theme") || "dark";
    }
    return "dark";
  });

   useEffect(() => {
    const html = document.documentElement;

    if (theme === "dark") {
      html.classList.remove("body-theme");
      sessionStorage.setItem("theme", "dark");
     } else {
      html.classList.add("body-theme");
      sessionStorage.setItem("theme", "light");
     }
  }, [theme]);

  const toggleTheme = () => {
    console.log("🔄 Toggle clicked! Current theme:", theme);
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const setThemeMode = (mode) => {
    setTheme(mode === "dark" ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        setThemeMode,
        isDark: theme === "dark",
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
