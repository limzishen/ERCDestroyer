import React from "react";
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import Feed from "./Feed.tsx";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Redirect / → /dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
