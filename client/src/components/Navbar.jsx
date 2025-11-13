import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>Sineva AI</h2>
      <div>
        <Link style={styles.link} to="/">Generate</Link>
        <Link style={styles.link} to="/manage">Manage</Link>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    background: "#007bff",
    padding: "12px 20px",
    color: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  logo: {
    margin: 0,
  },
  link: {
    color: "white",
    marginLeft: "15px",
    textDecoration: "none",
    fontWeight: "500"
  }
};
