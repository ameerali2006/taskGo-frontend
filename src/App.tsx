import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Signup } from "./pages/Signup";
import { Login } from "./pages/Login";
import { Tasks } from "./pages/Tasks";
import { ErrorPage } from "./pages/ErrorPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public authentication routes */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* Protected tasks dashboard route */}
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <Tasks />
              </ProtectedRoute>
            }
          />

          {/* Default redirect funnel */}
          <Route path="/" element={<Navigate to="/tasks" replace />} />
          
          {/* Error pages / Fallback routes */}
          <Route path="/500" element={<ErrorPage type="500" />} />
          <Route path="/network-error" element={<ErrorPage type="network" />} />
          <Route path="*" element={<ErrorPage type="404" />} />
        </Routes>
      </Router>
      <Toaster
        position="top-right"
        toastOptions={{
          className: "rounded-2xl border border-slate-100 bg-white text-slate-800 shadow-xl text-sm font-semibold p-4",
          style: {
            borderRadius: "16px",
            background: "#FFFFFF",
            color: "#0F172A",
            border: "1px solid #E2E8F0",
            boxShadow: "0 20px 25px -5px rgba(15, 23, 42, 0.05), 0 8px 10px -6px rgba(15, 23, 42, 0.05)",
          },
        }}
      />
    </AuthProvider>
  );
}

export default App;
