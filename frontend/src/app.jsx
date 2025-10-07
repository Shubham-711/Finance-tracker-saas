import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { DataProvider } from "./context/DataContext";

import Header from "./components/Header";
import Sidebar from "./components/sidebar";
import Login from "./pages/Login";
import Signup from "./pages/signup";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Goals from "./pages/Goals";
import Reports from "./pages/Reports";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" replace />;
};

const AppLayout = ({ children }) => (
  <div className="flex h-screen bg-gray-50">
    <Sidebar />
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header />
      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
  </div>
);

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
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<ProtectedPage component={Dashboard} />} />
        <Route path="/transactions" element={<ProtectedPage component={Transactions} />} />
        <Route path="/goals" element={<ProtectedPage component={Goals} />} />
        <Route path="/reports" element={<ProtectedPage component={Reports} />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;