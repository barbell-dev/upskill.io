import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./Dashboard";
import Login from "./Login";
import Signup from "./Signup";
import CreatorDashboard from "./CreatorDashboard";
import CreatorLogin from "./CreatorLogin";
function App() {
  // console.log(document.querySelector("#root").parentElement);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/creator/dashboard" element={<CreatorDashboard />} />

        <Route path="/creator/login" element={<CreatorLogin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
