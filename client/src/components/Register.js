import {useState} from "react";
import { useLanguage } from "./languageContext";

const Register = () => {
    const { getText } = useLanguage();
    const [registerUsername, setRegisterUsername] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");


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
          window.location.reload();
        } else {
          alert(data.message);
        }
      };
    return (
        <div className="auth-section">
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
       
      
      </div>
    );
  };
  
  export default Register;