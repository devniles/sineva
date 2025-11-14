// src/pages/Login.jsx
import React, { useState } from 'react';
import { Form, Card, Button, Alert, Container } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { setToken } from '../utils/api';

const API_BASE = import.meta.env.VITE_API_URL;

export default function Login() {
  const [form, setForm] = useState({ usernameOrEmail: '', password: '' });
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
      const res = await axios.post(`${API_BASE}/auth/login`, form);
      const data = res.data?.data;
      if (data?.token) {
        setToken(data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/');
      } else {
        setMessage('❌ Login failed');
      }
    } catch (err) {
      setMessage(err.response?.data?.message || '❌ Error logging in');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f0f2f5" }} className="d-flex align-items-center">
      <Container style={{ maxWidth: 450 }}>
        <Card className="p-4 shadow-sm border-0">
          <h3 className="text-center mb-4 fw-bold">Sineva AI Login</h3>

          {message && (
            <Alert variant={message.startsWith("❌") ? "danger" : "success"}>
              {message}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Username or Email</Form.Label>
              <Form.Control
                name="usernameOrEmail"
                value={form.usernameOrEmail}
                onChange={handleChange}
                placeholder="Enter username or email"
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter password"
                required
              />
            </Form.Group>

            <Button
              type="submit"
              className="w-100"
              disabled={loading}
              style={{ padding: "10px" }}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>

            <div className="text-center mt-3">
              <Button variant="link" onClick={() => navigate('/register')}>
                Don't have an account? Register
              </Button>
            </div>
          </Form>
        </Card>
      </Container>
    </div>
  );
}
