import React, { useState, useEffect } from "react";
import { useLanguage } from "./languageContext";

const AuthSection = () => {
  const { getText } = useLanguage();
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [usernames] = useState([]);
  const [selectedUsername, setSelectedUsername] = useState("");

  useEffect(() => {
    const populateUsernames = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/auth/users");
        const data = await response.json();
        const usernames = data.usernames;

        const usernameSelect = document.getElementById("usernameSelect");
        usernameSelect.innerHTML = ""; // Clear existing options

        usernames.forEach((username) => {
          const option = document.createElement("option");
          option.value = username;
          option.text = username;
          usernameSelect.appendChild(option);
        });
      } catch (error) {
        console.error("Failed to fetch usernames:", error);
      }
    };

    populateUsernames();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    // Send registration request to the server
    const response = await fetch("http://localhost:4000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: registerUsername,
        password: registerPassword,
      }),
    });

    const data = await response.json();

    if (data.status === "success") {
      alert("Registration successful!");
      setRegisterUsername("");
      setRegisterPassword("");
    } else {
      alert(data.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: selectedUsername,
          password: registerPassword,
        }), // Das Passwort sollte in einer sicheren Weise eingegeben werden
      });

      const data = await response.json();

      if (data.status === "success") {
        alert("Login successful!");
        // Hier können Sie den Benutzerstatus aktualisieren, z.B. einen Zustand setzen oder den Benutzer zu einer anderen Seite weiterleiten
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error occurs at loading:", error);
    }
  };

  return (
    <div id="authSection" className="container">
      <form id="registerForm" onSubmit={handleRegister}>
        <input
          type="text"
          id="registerUsername"
          placeholder={getText("usernamePlaceholder")}
          value={registerUsername}
          onChange={(e) => setRegisterUsername(e.target.value)}
        />
        <input
          type="password"
          id="registerPassword"
          placeholder={getText("passwordPlaceholder")}
          value={registerPassword}
          onChange={(e) => setRegisterPassword(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">
          {getText("registerButton")}
        </button>
      </form>
      <form id="loginForm" onSubmit={handleLogin}>
        <select
          id="usernameSelect"
          className="btn btn-login"
          value={selectedUsername}
          onChange={(e) => setSelectedUsername(e.target.value)}
        >
          {usernames.map((username, index) => (
            <option key={index} value={username}>
              {username}
            </option>
          ))}
        </select>
        <button type="submit" className="btn btn-login">
          {getText("loginButton")}
        </button>
      </form>
    </div>
  );
};

export default AuthSection;
