import React, { useState } from 'react';
import { useLanguage } from "./languageContext";


const AuthSection = ({onLogin}) => {
  const { getText } = useLanguage();
  const [isRegister, setIsRegister] = useState(true);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [ setPassword] = useState('');
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [selectedUsername] = useState(""); 

  const handleRegister = (newUser) => {
    setUsers([...users, newUser]);
    setIsRegister(false);
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
        onLogin(selectedUsername);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error occurs at loading:", error);
    }
  };

  return (
    <div>
      {isRegister ? (
        <div>
          <h1>Register</h1>
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
          <button onClick={() => setIsRegister(false)}>Login User</button>
        </div>
      ) : (
        <div>
          <h1>Login</h1>
          <select onChange={(e) => setSelectedUser(e.target.value)}>
            <option value="" disabled selected>
              Select User
            </option>
            {users.map((user, index) => (
              <option key={index} value={user}>
                {user}
              </option>
            ))}
          </select>

          {selectedUser && (
            <div>
              <label>Password:</label>
              <input type="password" onChange={(e) => setPassword(e.target.value)} />
            </div>
          )}

          <button onClick={handleLogin}>Login</button>
          <button onClick={() => setIsRegister(true)}>Register User</button>
        </div>
      )}
    </div>
  );
};

export default AuthSection;
