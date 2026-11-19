// src/contexts/LanguageContext.jsx
import { createContext, useContext, useState } from "react";
import en from "../locales/en.json";
import ru from "../locales/ru.json";
import ro from "../locales/ro.json";

const translations = { en, ru, ro };

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en");

  const getTranslation = (path) => {
    const keys = path.split(".");
    return keys.reduce((obj, key) => (obj ? obj[key] : null), translations[language]);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, getTranslation }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
