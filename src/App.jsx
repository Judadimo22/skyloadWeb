import React from "react";
import "./index.css";
import { HomePage } from "./Pages/HomePage";
import { Route, Routes } from "react-router";



function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
}

export default App;