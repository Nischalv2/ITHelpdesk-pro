import { useState } from "react";
import type { FormEvent } from "react";

type RegisterProps = {
  onRegistered: () => void;
};

const API_URL = "https://ithelpdesk-pro.onrender.com";

export default function Register({ onRegistered }: RegisterProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Registration failed");
        return;
      }

      setMessage("Registration successful. You can now log in.");
      setName("");
      setEmail("");
      setPassword("");

      setTimeout(onRegistered, 1000);
    } catch {
      setMessage("Unable to connect to server");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>ITHelpdesk-pro</h1>
        <h2>Create Account</h2>

        <input
          type="text"
          placeholder="Full name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <button type="submit">Register</button>

        {message && <p className="auth-message">{message}</p>}
      </form>
    </div>
  );
}