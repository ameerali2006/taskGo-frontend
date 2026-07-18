import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { AuthProvider } from "./context/AuthContext";
import { Signup } from "./pages/Signup";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Tasks } from "./pages/Tasks";
import { ErrorPage } from "./pages/ErrorPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import "./App.css";

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
      <Router>
        <Routes>
          {/* Public authentication routes */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* Protected dashboard analytics route */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected tasks management route */}
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <Tasks />
              </ProtectedRoute>
            }
          />

          {/* Default redirect funnel */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
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
    </Provider>
  );
}

export default App;
