import React, { useState } from "react";
import axios from "axios";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8080/api/auth/login", {
        username,
        password,
      });

      const apiResponse = response.data;

      if (apiResponse.success) {
        // Save JWT token to localStorage
        localStorage.setItem("token", apiResponse.data.token);
        localStorage.setItem("user", JSON.stringify(apiResponse.data.user));

        setMessage("Login successful!");
        console.log("Logged in user:", apiResponse.data.user);

        // Redirect after success (e.g., to dashboard)
        window.location.href = "/dashboard";
      } else {
        setMessage(apiResponse.message || "Login failed");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setMessage("Invalid username or password");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default LoginForm;
