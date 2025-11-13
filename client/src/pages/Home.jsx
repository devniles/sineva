import React, { useState } from "react";
import axios from "axios";
import {
  Card,
  Form,
  Row,
  Col,
  Button,
  Spinner,
  Alert,
  Container,
} from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import PersonaCard from "../components/PersonaCard";
import { usePersonaStore } from "../store";
import "react-bootstrap-typeahead/css/Typeahead.css";

const API_BASE = import.meta.env.VITE_API_URL;

export default function Home() {
  const [form, setForm] = useState({
    productName: "",
    category: "",
    targetMarket: "",
    objective: "",
    keywords: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState("");
  const { addPersona } = usePersonaStore();

  const categories = [
    "Technology",
    "Fashion",
    "Food & Beverages",
    "Fitness",
    "Education",
    "Healthcare",
    "Automobile",
    "Finance",
    "Beauty & Wellness",
    "Travel",
    "Real Estate",
    "Entertainment",
  ];

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleCategoryChange = (selected) =>
    setForm({ ...form, category: selected[0] || "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setMessage("");
    try {
      const payload = {
        ...form,
        keywords: form.keywords
          ? form.keywords.split(",").map((k) => k.trim())
          : [],
      };
      const res = await axios.post(`${API_BASE}/ai/generate`, payload);
      setResult(res.data.data);
    } catch (err) {
      console.error(err);
      setMessage("❌ Error generating personas. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await addPersona({
        productName: form.productName,
        category: form.category,
        targetMarket: form.targetMarket,
        objective: form.objective,
        keywords: form.keywords
          ? form.keywords.split(",").map((k) => k.trim())
          : [],
        personas: result.personas || [],
        summary: result.summary || "",
        toneRecommendation: result.toneRecommendation || "",
      });
      setMessage("✅ Persona saved successfully!");
      setTimeout(() => setMessage(""), 2500);
    } catch (err) {
      setMessage("❌ Error saving persona.");
    }
  };

  return (
    <Container fluid className="py-3 px-3 px-md-5">
      <Card className="shadow-sm p-4 mb-4 border-0">
        <h4 className="mb-4 fw-bold text-center text-md-start">
          <i className="bi bi-stars text-primary me-2"></i>
          Generate Audience Personas
        </h4>

        <Form onSubmit={handleSubmit}>
          <Row xs={1} md={2}>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>
                  <i className="bi bi-bag me-2 text-secondary"></i>
                  Product / Brand Name
                </Form.Label>
                <Form.Control
                  name="productName"
                  placeholder="e.g., Nike Air, iPhone, Herbal Tea..."
                  value={form.productName}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col>
              <Form.Group className="mb-3">
                <Form.Label>
                  <i className="bi bi-tags me-2 text-secondary"></i>
                  Category
                </Form.Label>
                <Typeahead
                  id="category"
                  onChange={handleCategoryChange}
                  options={categories}
                  selected={form.category ? [form.category] : []}
                  placeholder="Search or select a category..."
                  highlightOnlyResult
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>
              <i className="bi bi-people me-2 text-secondary"></i>
              Target Market / Niche
            </Form.Label>
            <Form.Control
              name="targetMarket"
              placeholder="e.g., Students, professionals, parents..."
              value={form.targetMarket}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              <i className="bi bi-bullseye me-2 text-secondary"></i>
              Objective
            </Form.Label>
            <Form.Control
              name="objective"
              placeholder="e.g., Brand awareness, lead generation..."
              value={form.objective}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>
              <i className="bi bi-key me-2 text-secondary"></i>
              Keywords (comma separated)
            </Form.Label>
            <Form.Control
              name="keywords"
              placeholder="e.g., organic, energy, hydration"
              value={form.keywords}
              onChange={handleChange}
            />
          </Form.Group>

          <div className="text-center text-md-start">
            <Button
              type="submit"
              variant="primary"
              className="px-4 py-2 w-100 w-md-auto"
              disabled={loading}
            >
              {loading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                <>
                  <i className="bi bi-lightning-charge me-2"></i>
                  Generate Personas
                </>
              )}
            </Button>
          </div>
        </Form>
      </Card>

      {message && (
        <Alert
          variant={message.startsWith("✅") ? "success" : "danger"}
          className="mt-3 text-center text-md-start"
        >
          {message}
        </Alert>
      )}

      {result && (
        <Card className="p-4 shadow-sm border-0 mt-4">
          <div className="d-flex flex-column flex-md-row align-items-center mb-3">
            <i className="bi bi-person-bounding-box text-primary fs-4 me-2"></i>
            <h5 className="mb-0 text-center text-md-start">
              Generated Personas
            </h5>
          </div>

          <Row xs={1} md={2} className="g-3">
            {result.personas?.map((p, i) => (
              <Col key={i}>
                <PersonaCard persona={p} />
              </Col>
            ))}
          </Row>

          <hr className="my-3" />

          <p className="mt-3">
            <strong>
              <i className="bi bi-info-circle me-1 text-secondary"></i>
              Summary:
            </strong>{" "}
            {result.summary}
          </p>

          <p>
            <strong>
              <i className="bi bi-megaphone me-1 text-secondary"></i>
              Tone Recommendation:
            </strong>{" "}
            {result.toneRecommendation}
          </p>

          <div className="mt-3 text-center text-md-start">
            <Button
              variant="success"
              onClick={handleSave}
              className="px-4 py-2 w-100 w-md-auto"
            >
              <i className="bi bi-save2 me-2"></i>Save to Database
            </Button>
          </div>
        </Card>
      )}
    </Container>
  );
}
