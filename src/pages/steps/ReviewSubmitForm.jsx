import React from "react";

export default function ReviewSubmitForm({ form }) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Review & Submit</h2>
      <div className="mb-2"><strong>Name:</strong> {form.name}</div>
      <div className="mb-2"><strong>Email:</strong> {form.email}</div>
      <div className="mb-2"><strong>Phone:</strong> {form.phone}</div>
      <div className="mb-2"><strong>Education:</strong>
        <ul>{(form.education || []).map((e, i) => <li key={i}>{e.degree} at {e.institution} ({e.year})</li>)}</ul>
      </div>
      <div className="mb-2"><strong>Experience:</strong>
        <ul>{(form.experience || []).map((e, i) => <li key={i}>{e.position} at {e.company} ({e.years})</li>)}</ul>
      </div>
      <div className="mb-2"><strong>Skills:</strong> {(form.skills || []).join(", ")}</div>
      <div className="mb-2"><strong>Certifications:</strong> {(form.certifications || []).join(", ")}</div>
      <div className="mt-4 text-green-700">Click Submit to save your resume.</div>
    </div>
  );
}
