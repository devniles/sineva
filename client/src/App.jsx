// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Home from "./pages/Home";
import Manage from "./pages/Manage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";

// Layout wrapper: hides sidebar + topbar for login/register
function Layout({ children }) {
  const location = useLocation();
  const noLayoutPaths = ["/login", "/register"];

  // If login/register → return page without layout
  if (noLayoutPaths.includes(location.pathname)) {
    return <>{children}</>;
  }

  // Normal layout (sidebar + topbar)
  return (
    <Container fluid className="p-0" style={{ minHeight: "100vh" }}>
      <Row className="g-0">
        <Col xs={12} md={2} className="p-0">
          <Sidebar />
        </Col>

        <Col xs={12} md={10} className="p-0">
          <Topbar />
          <div
            style={{
              padding: 20,
              background: "#f4f6f8",
              minHeight: "calc(100vh - 56px)",
            }}
          >
            {children}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Auth Pages (no sidebar/topbar) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Pages */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage"
            element={
              <ProtectedRoute>
                <Manage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
