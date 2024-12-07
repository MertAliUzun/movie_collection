import { useState } from "react";
import axios from "axios";

export default function AuthForm({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isRegister, setIsRegister] = useState(false); // Form modunu belirler (Login/Register)

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }

    try {
      const endpoint = isRegister ? "/api/register" : "/api/login";
      const response = await axios.post(endpoint, {
        clientName: username,
        password,
      });

      if (response.data.success || response.status === 201 || response.status === 200) {
        setError("");
        if (!isRegister) onLogin(response.data.clientName); // Sadece login sırasında giriş işlemi
        else {
          alert("Registration successful! Please log in.");
          setIsRegister(false); // Kayıttan sonra login moduna geç
        }
      } else {
        setError(response.data.error || "An error occurred.");
        console.log("1");
        console.log(response.status);
      }
    } catch (err) {
      console.error(`${isRegister ? "Registration" : "Login"} error:`, err);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="auth-form-container">
      <h1>{isRegister ? "Register" : "Login"}</h1>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="auth-button">
          {isRegister ? "Register" : "Login"}
        </button>
      </form>
      <p className="switch-form">
        {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
        <button
          type="button"
          className="toggle-button"
          onClick={() => {
            setError("");
            setIsRegister(!isRegister);
          }}
        >
          {isRegister ? "Login" : "Register"}
        </button>
      </p>
    </div>
  );
}
