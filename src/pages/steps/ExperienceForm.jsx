import React from "react";

export default function ExperienceForm({ form, setForm }) {
  const addExp = () => setForm({ ...form, experience: [...(form.experience || []), { company: "", position: "", years: "" }] });
  const updateExp = (idx, field, value) => {
    const updated = [...(form.experience || [])];
    updated[idx][field] = value;
    setForm({ ...form, experience: updated });
  };
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Experience</h2>
      {(form.experience || []).map((exp, idx) => (
        <div key={idx} className="mb-2">
          <input className="input" placeholder="Company" value={exp.company} onChange={e => updateExp(idx, "company", e.target.value)} />
          <input className="input ml-2" placeholder="Position" value={exp.position} onChange={e => updateExp(idx, "position", e.target.value)} />
          <input className="input ml-2" placeholder="Years" value={exp.years} onChange={e => updateExp(idx, "years", e.target.value)} />
        </div>
      ))}
      <button className="btn-primary mt-2" type="button" onClick={addExp}>Add Experience</button>
    </div>
  );
}
