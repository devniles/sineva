// src/components/Topbar.jsx
import React from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const navigate = useNavigate();
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <Navbar
      bg="white"
      expand="lg"
      className="shadow-sm border-bottom sticky-top"
      style={{ zIndex: 10 }}
    >
      <Container fluid className="d-flex justify-content-between align-items-center">
        <h5 className="fw-bold text-primary mb-0 d-flex align-items-center gap-2">
          <i className="bi bi-stars text-warning"></i>
          Sineva AI Dashboard
        </h5>

        <Nav className="align-items-center gap-3">
          <Button variant="outline-secondary" size="sm" title="Notifications">
            <i className="bi bi-bell-fill"></i>
          </Button>

          <Button variant="outline-secondary" size="sm" title="Settings">
            <i className="bi bi-gear-fill"></i>
          </Button>

          {user && (
            <div className="d-flex align-items-center gap-2 me-2">
              <small className="text-muted">Hi, {user.username}</small>
            </div>
          )}

          <Button variant="danger" size="sm" title="Logout" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right me-1"></i> Logout
          </Button>
        </Nav>
      </Container>
    </Navbar>
  );
}
