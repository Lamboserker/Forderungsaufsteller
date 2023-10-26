import React, {useState} from "react";
import LanguageDropdown from "./components/LanguageDropdown";
import AuthSection from "./components/AuthSection";
import MainContent from "./components/MainContent";
import { LanguageProvider } from "./components/languageContext";
import "./App.css";

const  App = () => {
  const [isLoggedIn] = useState(false);
  return (
    <LanguageProvider>
      <div className="App">
        <LanguageDropdown />
        <AuthSection />
        {isLoggedIn && <MainContent />}
      </div>
    </LanguageProvider>
  );
}

export default App;
