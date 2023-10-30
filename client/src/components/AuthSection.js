import React, { useState } from "react";
import Register from './Register';
import Login from './Login';
const AuthSection = ({ onLogin }) => {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div id="authSection" className="container">
      {showLogin ? (
        <Login onLogin={onLogin} />
      ) : (
        <Register />
      )}
      <button onClick={() => setShowLogin(!showLogin)}>
        Switch to {showLogin ? "Register" : "Login"}
      </button>
    </div>
  );
};

export default AuthSection;
