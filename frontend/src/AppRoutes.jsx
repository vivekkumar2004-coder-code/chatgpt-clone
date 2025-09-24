import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
