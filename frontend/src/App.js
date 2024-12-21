import React from "react";
import Form from "./components/Form";
import Table from "./components/Table";
import "./App.css"; // Import pliku CSS

function App() {
  const appStyle = {
    backgroundImage: "url('/images/FRED.jpg')",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    minHeight: "100vh", // Minimalna wysokość strony
    display: "flex", // Użycie flexbox do centrowania
    justifyContent: "center", // Wyśrodkowanie poziome
    alignItems: "flex-start", // Utrzymanie na tej samej wysokości
    flexDirection: "column", // Ustawienie elementów w kolumnie
    paddingTop: "20px", // Odstęp od góry
  };

  return (
    <div style={appStyle}>
      <h1 className="title">Session Data</h1>
      <Form />
    </div>
  );
}

export default App;