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
    createMetaAd,
    createLiveMetaAd,
  } = usePersonaStore();

  const [showCreateAd, setShowCreateAd] = useState(false);
  const [createAdPayload, setCreateAdPayload] = useState(null);
  const [createAdLoading, setCreateAdLoading] = useState(false);

  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [searchField, setSearchField] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [selected, setSelected] = useState([]); // checkbox selected

  useEffect(() => {
    fetchPersonas();
  }, []);

  // 🔍 Search Filter
  const filteredData = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return personas;

    return personas.filter((p) => {
      const f = {
        product: p.productName?.toLowerCase(),
        category: p.category?.toLowerCase(),
        summary: p.summary?.toLowerCase(),
        tone: p.toneRecommendation?.toLowerCase(),
      };

      if (searchField === "all") {
        return (
          f.product?.includes(q) ||
          f.category?.includes(q) ||
          f.summary?.includes(q) ||
          f.tone?.includes(q)
        );
      }
      return f[searchField]?.includes(q);
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
    setMessage("🗑 Deleted successfully!");
    setTimeout(() => setMessage(""), 2500);
  };

  // 📤 CSV
  const exportCSV = () => {
    const rows = selected.length
      ? personas.filter((p) => selected.includes(p._id))
      : filteredData;

    const csv =
      "data:text/csv;charset=utf-8," +
      [
        ["Product", "Category", "Summary", "Tone"],
        ...rows.map((p) => [
          p.productName,
          p.category,
          p.summary,
          p.toneRecommendation,
        ]),
      ]
        .map((r) => r.join(","))
        .join("\n");

    const a = document.createElement("a");
    a.href = encodeURI(csv);
    a.download = "personas.csv";
    a.click();
  };

  // 📤 Excel
  const exportExcel = () => {
    const rows = selected.length
      ? personas.filter((p) => selected.includes(p._id))
      : filteredData;

    let html = `
      <table>
      <tr><th>Product</th><th>Category</th><th>Summary</th><th>Tone</th></tr>
      `;

    rows.forEach((p) => {
      html += `
        <tr>
          <td>${p.productName}</td>
          <td>${p.category}</td>
          <td>${p.summary}</td>
          <td>${p.toneRecommendation}</td>
        </tr>`;
    });

    html += "</table>";

    const blob = new Blob([html], { type: "application/vnd.ms-excel" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "personas.xls";
    a.click();
  };

  // ⭐ ⭐ EXPORT FOR META ADS
  const exportMetaAds = () => {
    const rows = selected.length
      ? personas.filter((p) => selected.includes(p._id))
      : filteredData;

    const metaRows = rows.map((p) => {
      const persona = p.personas?.[0] || {};

      return {
        gender: persona.gender || "",
        age_range: persona.age || "",
        city: persona.location || "",
        interests: persona.interests?.join(";") || "",
      };
    });

    let csv = "gender,age_range,city,interests\n";
    metaRows.forEach((r) => {
      csv += `${r.gender},${r.age_range},${r.city},${r.interests}\n`;
    });

    const a = document.createElement("a");
    a.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
    a.download = "meta_ads_audience.csv";
    a.click();
  };

  // Loader
  if (loading)
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    );

  return (
    <div className="container-fluid py-3">
      {/* Top Controls */}
      <Row className="align-items-center mb-3 g-3">
        <Col xs="12" md="3">
          <h4 className="fw-bold ps-2">📋 Manage Personas</h4>
        </Col>

        <Col xs="12" md="6">
          <InputGroup className="ms-2">
            <Form.Control
              placeholder={`Search in ${
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
              <option value="all">All</option>
              <option value="product">Product</option>
              <option value="category">Category</option>
              <option value="summary">Summary</option>
              <option value="tone">Tone</option>
            </Form.Select>
          </InputGroup>
        </Col>

        <Col xs="auto" md="2">
          <Form.Select
            size="sm"
            value={perPage}
            onChange={(e) => setPerPage(Number(e.target.value))}
            style={{ width: "130px" }}
          >
            <option value="5">5 per page</option>
            <option value="10">10 per page</option>
            <option value="20">20 per page</option>
          </Form.Select>
        </Col>
      </Row>

      {/* Export Buttons */}
      <div className="d-flex gap-2 ms-2 mb-3 flex-wrap">
        <Button size="sm" variant="success" onClick={exportCSV}>
          CSV Export
        </Button>
        <Button size="sm" variant="primary" onClick={exportExcel}>
          Excel Export
        </Button>
        <Button size="sm" variant="warning" onClick={exportMetaAds}>
          Meta Ads Export
        </Button>
      </div>

      {message && (
        <Alert variant="success" className="ms-2">
          {message}
        </Alert>
      )}

      {/* Responsive Table */}
      <div className="table-responsive px-2">
        <Table bordered hover className="bg-white shadow-sm align-middle">
          <thead className="table-primary">
            <tr>
              <th>
                <Form.Check
                  type="checkbox"
                  checked={currentData.every((p) =>
                    selected.includes(p._id)
                  )}
                  onChange={(e) => {
                    if (e.target.checked)
                      setSelected(currentData.map((p) => p._id));
                    else setSelected([]);
                  }}
                />
              </th>
              <th>#</th>
              <th>Product</th>
              <th>Category</th>
              <th>Summary</th>
              <th>Tone</th>
              <th width="180px" className="text-center">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {currentData.map((p, i) => (
              <tr key={p._id}>
                <td>
                  <Form.Check
                    type="checkbox"
                    checked={selected.includes(p._id)}
                    onChange={(e) =>
                      e.target.checked
                        ? setSelected([...selected, p._id])
                        : setSelected(
                            selected.filter((id) => id !== p._id)
                          )
                    }
                  />
                </td>

                <td>{startIdx + i + 1}</td>
                <td>{p.productName}</td>
                <td>{p.category}</td>

                <td style={{ maxWidth: "250px", wordBreak: "break-word" }}>
                  <div className="d-none d-md-block text-truncate">
                    {p.summary}
                  </div>
                  <div className="d-block d-md-none">{p.summary}</div>
                </td>

                <td>{p.toneRecommendation}</td>

                <td className="text-center">
                  <div className="d-flex gap-2 justify-content-center flex-wrap">
                    <Button
                      size="sm"
                      variant="outline-primary"
                      onClick={() => handleEdit(p)}
                    >
                      Edit
                    </Button>

                   

                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => {
                        setCreateAdPayload({
                          persona: p,
                          creative: {
                            headline: `For ${p.productName || p.summary || p.name || 'Customers'}`,
                            body: p.summary || '',
                          },
                          audience: {
                            interests: p.personas?.[0]?.interests || p.interests || [],
                            ageRange: p.personas?.[0]?.age || p.ageRange || '',
                            location: p.personas?.[0]?.location || '',
                          },
                          link: '',
                          adsetId: '',
                          budget: 1000,
                        });
                        setShowCreateAd(true);
                      }}
                    >
                      Create Live Ad
                    </Button>

                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => {
                        setSelectedId(p._id);
                        setShowDelete(true);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}

            {!currentData.length && (
              <tr>
                <td colSpan="7" className="text-center py-4 text-muted">
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

      {/* Create Live Ad Modal */}
      <Modal show={showCreateAd} onHide={() => setShowCreateAd(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Create Live Meta Ad</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {createAdPayload && (
            <Form>
              <Row className="mb-3">
                <Col>
                  <Form.Label>Headline</Form.Label>
                  <Form.Control
                    value={createAdPayload.creative.headline}
                    onChange={(e) =>
                      setCreateAdPayload({
                        ...createAdPayload,
                        creative: { ...createAdPayload.creative, headline: e.target.value },
                      })
                    }
                  />
                </Col>

                <Col>
                  <Form.Label>Link</Form.Label>
                  <Form.Control
                    value={createAdPayload.link}
                    onChange={(e) => setCreateAdPayload({ ...createAdPayload, link: e.target.value })}
                  />
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Body</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={createAdPayload.creative.body}
                  onChange={(e) =>
                    setCreateAdPayload({
                      ...createAdPayload,
                      creative: { ...createAdPayload.creative, body: e.target.value },
                    })
                  }
                />
              </Form.Group>

              <Row className="mb-3">
                <Col>
                  <Form.Label>Adset ID (optional)</Form.Label>
                  <Form.Control
                    value={createAdPayload.adsetId}
                    onChange={(e) => setCreateAdPayload({ ...createAdPayload, adsetId: e.target.value })}
                    placeholder="Provide existing adset id to create a real ad"
                  />
                </Col>

                <Col>
                  <Form.Label>Budget (optional)</Form.Label>
                  <Form.Control
                    type="number"
                    value={createAdPayload.budget}
                    onChange={(e) => setCreateAdPayload({ ...createAdPayload, budget: Number(e.target.value) })}
                  />
                </Col>
              </Row>

              <Form.Group>
                <Form.Label>Audience interests (comma separated)</Form.Label>
                <Form.Control
                  value={(createAdPayload.audience.interests || []).join(',')}
                  onChange={(e) =>
                    setCreateAdPayload({
                      ...createAdPayload,
                      audience: { ...createAdPayload.audience, interests: e.target.value.split(',').map(s => s.trim()).filter(Boolean) },
                    })
                  }
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateAd(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            disabled={createAdLoading}
            onClick={async () => {
              try {
                setCreateAdLoading(true);
                const resp = await createLiveMetaAd(createAdPayload);
                // resp may contain helpful message or data
                setMessage(resp?.message || '✅ Live ad request completed');
                setTimeout(() => setMessage(''), 4000);
                setShowCreateAd(false);
              } catch (err) {
                setMessage(err.response?.data?.message || '⚠️ Failed to create live ad (see console)');
                setTimeout(() => setMessage(''), 4000);
              } finally {
                setCreateAdLoading(false);
              }
            }}
          >
            {createAdLoading ? <Spinner size="sm" animation="border" /> : 'Create Live Ad'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEdit} onHide={() => setShowEdit(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Persona</Modal.Title>
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
                      setEditData({
                        ...editData,
                        productName: e.target.value,
                      })
                    }
                  />
                </Col>

                <Col>
                  <Form.Label>Category</Form.Label>
                  <Form.Control
                    value={editData.category}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        category: e.target.value,
                      })
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
                    setEditData({
                      ...editData,
                      summary: e.target.value,
                    })
                  }
                />
              </Form.Group>

              <Form.Group>
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
            Cancel
          </Button>
          <Button variant="success" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Modal */}
      <Modal show={showDelete} onHide={() => setShowDelete(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this persona?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDelete(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
