import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Components
import Header from "./components/Header";
import Sidebar from "./components/sidebar"; 

// Pages
import Login from "./pages/Login";
import Signup from "./pages/signup"; 
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Goals from "./pages/Goals";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };
  return (
    <Router>
      <div className="flex h-screen">
        {/* Sidebar on the left */}
        <Sidebar />

        <div className="flex flex-col flex-1">
          {/* Header always on top */}
          <Header />

          {/* Main content area */}
          <main className="p-6 flex-1 overflow-y-auto bg-gray-50">
            <Routes>
              <Route path="/" element={<Login onLoginSuccess={handleLoginSuccess} />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/goals" element={<Goals />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
