import React, { useEffect, useState, useMemo } from "react";
import { usePersonaStore } from "../store";
import {
  Table,
  Button,
  Modal,
  Form,
  Spinner,
  Alert,
  Row,
  Col,
  Pagination,
  InputGroup,
} from "react-bootstrap";

export default function Manage() {
  const {
    personas,
    fetchPersonas,
    deletePersona,
    updatePersona,
    loading,
  } = usePersonaStore();

  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [searchField, setSearchField] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);

  useEffect(() => {
    fetchPersonas();
  }, []);

  // 🔍 Search Filter
  const filteredData = useMemo(() => {
    const query = search.toLowerCase();
    if (!query) return personas;

    return personas.filter((p) => {
      const fields = {
        product: p.productName?.toLowerCase(),
        category: p.category?.toLowerCase(),
        summary: p.summary?.toLowerCase(),
        tone: p.toneRecommendation?.toLowerCase(),
      };

      if (searchField === "all") {
        return (
          fields.product?.includes(query) ||
          fields.category?.includes(query) ||
          fields.summary?.includes(query) ||
          fields.tone?.includes(query)
        );
      } else {
        return fields[searchField]?.includes(query);
      }
    });
  }, [personas, search, searchField]);

  // 📄 Pagination
  const totalPages = Math.ceil(filteredData.length / perPage);
  const startIdx = (currentPage - 1) * perPage;
  const currentData = filteredData.slice(startIdx, startIdx + perPage);

  // ✏ Edit
  const handleEdit = (p) => {
    setEditData({ ...p });
    setShowEdit(true);
  };

  const handleSave = async () => {
    await updatePersona(editData._id, editData);
    setShowEdit(false);
    setMessage("✅ Persona updated successfully!");
    setTimeout(() => setMessage(""), 2500);
  };

  // 🗑 Delete
  const handleDeleteConfirm = async () => {
    await deletePersona(selectedId);
    setShowDelete(false);
    setMessage("🗑️ Persona deleted successfully!");
    setTimeout(() => setMessage(""), 2500);
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div className="container-fluid py-3">
      <Row className="align-items-center mb-3 g-3">
        <Col xs="12" md="3">
          <h4 className="fw-bold mb-0 ps-2">📋 Manage Personas</h4>
        </Col>

        {/* Search Input */}
        <Col xs="12" md="6">
          <InputGroup className="ms-2">
            <Form.Control
              type="text"
              placeholder={`🔍 Search in ${
                searchField === "all" ? "all fields" : searchField
              }...`}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />

            <Form.Select
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
              style={{ maxWidth: "180px" }}
            >
              <option value="all">All Fields</option>
              <option value="product">Product</option>
              <option value="category">Category</option>
              <option value="summary">Summary</option>
              <option value="tone">Tone</option>
            </Form.Select>
          </InputGroup>
        </Col>

        {/* Per Page */}
        <Col xs="auto" md="2">
          <Form.Select
            size="sm"
            value={perPage}
            onChange={(e) => setPerPage(Number(e.target.value))}
            style={{ width: "130px", marginLeft: "10px" }}
          >
            <option value="5">5 per page</option>
            <option value="10">10 per page</option>
            <option value="20">20 per page</option>
          </Form.Select>
        </Col>
      </Row>

      {message && (
        <Alert variant="success" className="ms-2">
          {message}
        </Alert>
      )}

      {/* 📱 FULL RESPONSIVE TABLE */}
      <div className="table-responsive px-2" style={{ overflowX: "auto" }}>
        <Table bordered hover className="bg-white shadow-sm align-middle">
          <thead className="table-primary">
            <tr>
              <th>#</th>
              <th>Product</th>
              <th>Category</th>
              <th>Summary</th>
              <th>Tone</th>
              <th width="180px" className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentData.map((p, index) => (
              <tr key={p._id}>
                <td>{startIdx + index + 1}</td>
                <td>{p.productName}</td>
                <td>{p.category}</td>

                {/* Responsive Summary */}
                <td
                  style={{
                    maxWidth: "250px",
                    whiteSpace: "normal",
                    wordWrap: "break-word",
                  }}
                >
                  {/* Desktop truncate */}
                  <div
                    className="text-truncate d-none d-md-block"
                    title={p.summary}
                  >
                    {p.summary}
                  </div>

                  {/* Mobile full wrap */}
                  <div className="d-block d-md-none">
                    {p.summary}
                  </div>
                </td>

                <td>{p.toneRecommendation}</td>

                <td className="text-center">
                  <div className="d-flex justify-content-center gap-2 flex-wrap">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleEdit(p)}
                    >
                      <i className="bi bi-pencil-square me-1"></i> Edit
                    </Button>

                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => {
                        setSelectedId(p._id);
                        setShowDelete(true);
                      }}
                    >
                      <i className="bi bi-trash3 me-1"></i> Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}

            {currentData.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-muted py-4">
                  No personas found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-3">
          <Pagination>
            {[...Array(totalPages)].map((_, i) => (
              <Pagination.Item
                key={i + 1}
                active={i + 1 === currentPage}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </div>
      )}

      {/* Edit Modal */}
      <Modal show={showEdit} onHide={() => setShowEdit(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-pencil-square me-2 text-primary"></i> Edit Persona
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editData && (
            <Form>
              <Row className="mb-3">
                <Col>
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control
                    value={editData.productName}
                    onChange={(e) =>
                      setEditData({ ...editData, productName: e.target.value })
                    }
                  />
                </Col>
                <Col>
                  <Form.Label>Category</Form.Label>
                  <Form.Control
                    value={editData.category}
                    onChange={(e) =>
                      setEditData({ ...editData, category: e.target.value })
                    }
                  />
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Summary</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={editData.summary}
                  onChange={(e) =>
                    setEditData({ ...editData, summary: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Tone Recommendation</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={editData.toneRecommendation}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      toneRecommendation: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEdit(false)}>
            <i className="bi bi-x-circle me-1"></i> Cancel
          </Button>
          <Button variant="success" onClick={handleSave}>
            <i className="bi bi-check-circle me-1"></i> Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Modal */}
      <Modal show={showDelete} onHide={() => setShowDelete(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-exclamation-triangle-fill text-danger me-2"></i>
            Confirm Delete
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this persona?
          This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDelete(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            <i className="bi bi-trash3 me-1"></i> Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
