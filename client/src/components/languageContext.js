import React, { createContext, useState, useContext } from "react";
import { getText, setLanguage } from "./index.js"; // Importiere deine Funktionen aus index.js

const LanguageContext = createContext();

export const useLanguage = () => {
  return useContext(LanguageContext);
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState("english");

  const changeLanguage = (language) => {
    setLanguage(language);
    setCurrentLanguage(language);
  };

  return (
    <LanguageContext.Provider
      value={{ currentLanguage, changeLanguage, getText }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
