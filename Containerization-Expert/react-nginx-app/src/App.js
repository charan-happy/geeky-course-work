import React, { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts/1", {
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    })
      .then(res => res.json())
      .then(data => setMessage(data.title))
      .catch(err => setMessage("CORS or fetch error"));
  }, []);

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        height: "100vh",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        fontFamily: "'Poppins', sans-serif",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>🚀 React + Nginx + Docker</h1>
      <p style={{ fontSize: "1.2rem", maxWidth: "600px" }}>
        API Response: <strong>{message}</strong>
      </p>
    </div>
  );
}

export default App;

