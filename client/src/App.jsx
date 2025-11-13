import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Home from "./pages/Home";
import Manage from "./pages/Manage";

export default function App() {
  return (
    <BrowserRouter>
      <Container fluid className="p-0" style={{ minHeight: "100vh" }}>
        <Row className="g-0">
          <Col xs={3} md={2} className="p-0">
            <Sidebar />
          </Col>

          <Col xs={9} md={10} className="p-0">
            <Topbar />
            <div style={{ padding: 20, background: "#f4f6f8", minHeight: "calc(100vh - 56px)" }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/manage" element={<Manage />} />
              </Routes>
            </div>
          </Col>
        </Row>
      </Container>
    </BrowserRouter>
  );
}
