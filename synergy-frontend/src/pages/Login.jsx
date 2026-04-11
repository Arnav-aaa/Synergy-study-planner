import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [sessionInput, setSessionInput] = useState("");

  // 🚀 Create Session
  const handleCreate = () => {
    if (!name.trim()) {
      alert("Please enter your name");
      return;
    }

    const sessionId = Math.random().toString(36).substring(2, 8);

    localStorage.setItem("username", name);

    navigate(`/session/${sessionId}`);
  };

  // 🔗 Join Session
  const handleJoin = () => {
    if (!name.trim() || !sessionInput.trim()) {
      alert("Please enter name and session ID");
      return;
    }

    localStorage.setItem("username", name);

    navigate(`/session/${sessionInput}`);
  };

  return (
    <div className="login-page">
      <div className="card">

        <h1 className="logo-title">Synergy</h1>
        <p className="subtitle">Collaborative Study Planner</p>

        {/* 👤 Name Input */}
        <input
          type="text"
          placeholder="Enter your name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input"
        />

        {/* 🚀 Create Session */}
        <button className="btn-primary" onClick={handleCreate}>
          🚀 Create Session
        </button>

        {/* 🔗 Session ID Input */}
        <input
          type="text"
          placeholder="Enter session ID..."
          value={sessionInput}
          onChange={(e) => setSessionInput(e.target.value)}
          className="input"
        />

        {/* 🔗 Join Session */}
        <button className="btn-primary" onClick={handleJoin}>
          🔗 Join Session
        </button>

      </div>
    </div>
  );
}