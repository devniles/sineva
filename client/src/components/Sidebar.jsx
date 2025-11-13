import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ListGroup, Button } from "react-bootstrap";

export default function Sidebar() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false); 

  const links = [
    { path: "/", label: "Generate Personas", icon: "bi-lightning-charge" },
    { path: "/manage", label: "Manage Personas", icon: "bi-table" },
  ];

  return (
    <>
     
      <div className="d-md-none d-flex p-2 bg-primary text-white align-items-center">
        <Button
          variant="light"
          size="sm"
          className="me-2"
          onClick={() => setOpen(true)}
        >
          <i className="bi bi-list"></i>
        </Button>
        <h5 className="mb-0">Sineva AI</h5>
      </div>

      <div
        className="sidebar-container"
        style={{
          position: "fixed",
          top: 0,
          left: open ? 0 : "-100%",
          height: "100vh",
          width: "80%",          // Mobile width
          maxWidth: "250px",     // Desktop width
          background: "#fff",
          zIndex: 9999,
          transition: "left 0.3s ease",
          borderRight: "1px solid #ddd",
        }}
      >
        {/* Close button for Mobile */}
        <div className="d-md-none d-flex justify-content-end p-2">
          <Button variant="outline-danger" size="sm" onClick={() => setOpen(false)}>
            <i className="bi bi-x-lg"></i>
          </Button>
        </div>

        {/* Brand Section */}
        <div className="p-3 text-center border-bottom bg-gradient bg-primary text-white">
          <div className="d-flex align-items-center justify-content-center gap-2">
            <i className="bi bi-stars fs-3 text-light"></i>
            <h5 className="mb-0 fw-bold text-light">Sineva AI</h5>
          </div>
          <small className="text-light-50 fw-lighter">Persona Generator</small>
        </div>

        {/* Menu */}
        <ListGroup variant="flush" className="mt-3">
          {links.map((link) => (
            <ListGroup.Item
              key={link.path}
              as={Link}
              to={link.path}
              onClick={() => setOpen(false)}  
              className={`d-flex align-items-center gap-3 py-3 px-3 border-0 ${
                pathname === link.path
                  ? "bg-primary text-white fw-bold shadow-sm"
                  : "text-dark"
              }`}
              style={{ cursor: "pointer", fontSize: "15px", transition: "0.2s" }}
            >
              <i
                className={`bi ${link.icon} fs-5 ${
                  pathname === link.path ? "text-white" : "text-primary"
                }`}
              ></i>

              <span>{link.label}</span>
            </ListGroup.Item>
          ))}
        </ListGroup>

        {/* Footer */}
        <div className="mt-auto text-center small text-secondary p-3 border-top">
          <i className="bi bi-c-circle me-1"></i>
          {new Date().getFullYear()} Sineva AI
        </div>
      </div>

      {/* ======== DARK OVERLAY (when sidebar open) ======== */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            background: "rgba(0,0,0,0.5)",
            width: "100vw",
            height: "100vh",
            zIndex: 999,
          }}
          className="d-md-none"
        ></div>
      )}
    </>
  );
}
