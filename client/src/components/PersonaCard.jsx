import React from "react";
import { Card } from "react-bootstrap";

export default function PersonaCard({ persona }) {
  const toList = (v) => {
    if (!v) return "";
    return Array.isArray(v) ? v.join(", ") : v;
  };

  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body>
        <Card.Title>{persona.name}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{persona.ageRange} • {persona.occupation}</Card.Subtitle>
        <p><strong>Interests:</strong> {toList(persona.interests)}</p>
        <p><strong>Pain Points:</strong> {toList(persona.painPoints)}</p>
        <p><strong>Messaging Hooks:</strong> {toList(persona.messagingHooks)}</p>
      </Card.Body>
    </Card>
  );
}
