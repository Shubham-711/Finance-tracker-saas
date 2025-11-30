import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { DataProvider } from "./context/DataContext";

import Sidebar from "./components/sidebar";
import Login from "./pages/Login";
import Signup from "./pages/signup";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Goals from "./pages/Goals";
import Reports from "./pages/Reports";
import SmoothScroll from "./components/SmoothScroll";

console.log("USING APP FROM:", import.meta.url);
console.log("HELLO FROM REACT");

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

const AppLayout = ({ children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-ambient-gradient text-white flex relative">
      {/* Sidebar */}
      <Sidebar open={open} setOpen={setOpen} />

      {/* Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="p-4 flex items-center gap-3">
          <button
            onClick={() => setOpen(true)}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white"
          >
            ☰
          </button>
        </div>

        {/* MAIN PAGE CONTENT */}
        <div className="px-8 pb-12">
          {children}
        </div>
      </div>
    </div>
  );
};

const ProtectedPage = ({ component: Component }) => (
  <ProtectedRoute>
    <DataProvider>
      <AppLayout>
        <Component />
      </AppLayout>
    </DataProvider>
  </ProtectedRoute>
);

function App() {
  return (
    <SmoothScroll>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedPage component={Dashboard} />} />
          <Route path="/transactions" element={<ProtectedPage component={Transactions} />} />
          <Route path="/goals" element={<ProtectedPage component={Goals} />} />
          <Route path="/reports" element={<ProtectedPage component={Reports} />} />
          
          {/* Redirects */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </SmoothScroll>
  );
}

export default App;
