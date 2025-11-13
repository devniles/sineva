import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ListGroup } from "react-bootstrap";

export default function Sidebar() {
  const { pathname } = useLocation();

  const links = [
    { path: "/", label: "Generate Personas", icon: "bi-lightning-charge" },
    { path: "/manage", label: "Manage Personas", icon: "bi-table" },
  ];

  return (
    <div
      className="d-flex flex-column align-items-stretch h-100 bg-white border-end shadow-sm"
      style={{ width: "250px" }}
    >
      {/* ✅ Brand Section */}
      <div className="p-3 text-center border-bottom bg-gradient bg-primary text-white">
        <div className="d-flex align-items-center justify-content-center gap-2">
          <i
            className="bi bi-stars fs-3 text-light"
            style={{ filter: "drop-shadow(0 0 1px #000)" }}
          ></i>
          <h5 className="mb-0 fw-bold text-light">Sineva AI</h5>
        </div>
        <small className="text-light-50 fw-lighter">Persona Generator</small>
      </div>

      {/* ✅ Menu Links */}
      <ListGroup variant="flush" className="mt-3">
        {links.map((link) => (
          <ListGroup.Item
            key={link.path}
            as={Link}
            to={link.path}
            className={`d-flex align-items-center gap-3 py-3 px-3 border-0 ${
              pathname === link.path
                ? "bg-primary text-white fw-bold shadow-sm"
                : "text-dark"
            }`}
            style={{
              cursor: "pointer",
              fontSize: "15px",
              transition: "0.2s",
            }}
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

      {/* ✅ Footer */}
      <div className="mt-auto text-center small text-secondary p-3 border-top">
        <i className="bi bi-c-circle me-1"></i>
        {new Date().getFullYear()} Sineva AI
      </div>
    </div>
  );
}
