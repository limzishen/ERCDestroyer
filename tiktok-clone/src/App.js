import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import DeepAnalytics from './DeepAnalytics';
import Notifications from './Notifications';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/deepanalytics" element={<DeepAnalytics />} />
        <Route path="/notifications" element={<Notifications />} />
        {/* Add other routes here if needed */}
      </Routes>
    </Router>
  )
}

export default App;
