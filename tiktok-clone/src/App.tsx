import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import Dashboard from "./Dashboard.tsx";
//import Feed from "./Feed.tsx";
import LoginPage from "./pages/Login.tsx";
import RegistrationPage from "./pages/Registration.tsx";
import ProtectedRoute from "./components/ProtectedRoutes.tsx";
import Notifications from './pages/Notifications.tsx';
import AdvancedAnalytics from './pages/AdvancedAnalytics.tsx';
import PostAnalytics from './pages/PostAnalytics.tsx';
import PostAdvancedAnalytics from './pages/PostAdvancedAnalytics.tsx';


const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard/>
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <Notifications/>
                </ProtectedRoute>
              }
            />

            <Route
              path="/advanced-analytics"
              element={
                <ProtectedRoute>
                  <AdvancedAnalytics/>
                </ProtectedRoute>
              }
            />
            <Route
              path="/post-analytics/:postId"
              element={
                <ProtectedRoute>
                  <PostAnalytics/>
                </ProtectedRoute>
              }
            />
            <Route
              path="/post-advanced-analytics/:postId"
              element={
                <ProtectedRoute>
                  <PostAdvancedAnalytics/>
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" />} />
            {/* <Route

              path="/feed"
              element={
                <ProtectedRoute>
                  <Feed/>
                </ProtectedRoute>
              }
            /> */}
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;