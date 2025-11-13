import React from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";

export default function Topbar() {
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

          <Button variant="danger" size="sm" title="Logout">
            <i className="bi bi-box-arrow-right me-1"></i> Logout
          </Button>
        </Nav>
      </Container>
    </Navbar>
  );
}
