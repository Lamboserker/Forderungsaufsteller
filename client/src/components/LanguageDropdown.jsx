import React from "react";
import { useLanguage } from "./languageContext.jsx";

const LanguageDropdown = () => {
  const { currentLanguage, changeLanguage } = useLanguage();

  const handleLanguageChange = (e) => {
    changeLanguage(e.target.value);
    console.log(currentLanguage);
  };

  return (
    <div id="languageDropdownContainer">
      <label htmlFor="languageDropdown">Language:</label>
      <select
        id="languageDropdown"
        value={currentLanguage}
        onChange={handleLanguageChange}
      >
        <option value="english">English</option>
        <option value="german">German</option>
      </select>
    </div>
  );
};

export default LanguageDropdown;
