import React from "react";

export default function EducationForm({ form, setForm }) {
  const addEdu = () => setForm({ ...form, education: [...(form.education || []), { institution: "", degree: "", year: "" }] });
  const updateEdu = (idx, field, value) => {
    const updated = [...(form.education || [])];
    updated[idx][field] = value;
    setForm({ ...form, education: updated });
  };
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Education</h2>
      {(form.education || []).map((edu, idx) => (
        <div key={idx} className="mb-2">
          <input className="input" placeholder="Institution" value={edu.institution} onChange={e => updateEdu(idx, "institution", e.target.value)} />
          <input className="input ml-2" placeholder="Degree" value={edu.degree} onChange={e => updateEdu(idx, "degree", e.target.value)} />
          <input className="input ml-2" placeholder="Year" value={edu.year} onChange={e => updateEdu(idx, "year", e.target.value)} />
        </div>
      ))}
      <button className="btn-primary mt-2" type="button" onClick={addEdu}>Add Education</button>
    </div>
  );
}
