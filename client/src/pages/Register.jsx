// src/pages/Register.jsx
import React, { useState } from 'react';
import { Form, Card, Button, Alert, Container } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { setToken } from '../utils/api';

const API_BASE = import.meta.env.VITE_API_URL;

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await axios.post(`${API_BASE}/auth/register`, form);
      const data = res.data?.data;

      if (data?.token) {
        setToken(data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/');
      } else {
        setMessage('❌ Registration failed');
      }
    } catch (err) {
      setMessage(err.response?.data?.message || '❌ Error registering');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f0f2f5" }} className="d-flex align-items-center">
      <Container style={{ maxWidth: 450 }}>
        <Card className="p-4 shadow-sm border-0">
          <h3 className="text-center mb-4 fw-bold">Create Account</h3>

          {message && (
            <Alert variant={message.startsWith("❌") ? "danger" : "success"}>
              {message}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Enter username"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email (optional)</Form.Label>
              <Form.Control
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter email"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Enter password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Button
              type="submit"
              className="w-100"
              disabled={loading}
              style={{ padding: "10px" }}
            >
              {loading ? "Registering..." : "Register"}
            </Button>

            <div className="text-center mt-3">
              <Button variant="link" onClick={() => navigate('/login')}>
                Already have an account? Login
              </Button>
            </div>
          </Form>
        </Card>
      </Container>
    </div>
  );
}
