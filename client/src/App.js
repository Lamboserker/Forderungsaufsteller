import React, {useState} from "react";
import LanguageDropdown from "./components/LanguageDropdown";
import AuthSection from "./components/AuthSection";
import MainContent from "./components/MainContent";
import { LanguageProvider } from "./components/languageContext";
import "./App.css";

const  App = () => {
  const [userIsLoggedIn, setUserIsLoggedIn] = useState(false);
  const [username, setUsername] = useState(null);

  const handleLogin = (newUsername) => {
    // Implementieren Sie hier die Anmelde-Logik, z.B. API-Aufruf

    // Bei Erfolg:
    setUsername(newUsername);
    setUserIsLoggedIn(true);
  };

  const handleLogout = () => {
    setUsername(null);
    setUserIsLoggedIn(false);
  };

  return (
    <LanguageProvider>
      <div className="App">
        <LanguageDropdown />
        {userIsLoggedIn ? (
          <>
            <button onClick={handleLogout}>Logout</button>
            <MainContent username={username} />
          </>
        ) : (
          <AuthSection onLogin={handleLogin} />
        )}
      </div>
    </LanguageProvider>
  );
};

export default App;
