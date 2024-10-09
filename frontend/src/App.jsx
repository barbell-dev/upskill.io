import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./Home";
import Login from "./Login";
import Signup from "./Signup";
function App() {
  <BrowserRouter>
    <Routes>
      <Route path="/" element={Home} />
      <Route path="/login" element={Login} />
      <Route path="/signup" element={Signup} />
    </Routes>
  </BrowserRouter>;
}

export default App;
