import React from "react";

export default function SkillsCertsForm({ form, setForm }) {
  const addSkill = () => setForm({ ...form, skills: [...(form.skills || []), ""] });
  const updateSkill = (idx, value) => {
    const updated = [...(form.skills || [])];
    updated[idx] = value;
    setForm({ ...form, skills: updated });
  };
  const addCert = () => setForm({ ...form, certifications: [...(form.certifications || []), ""] });
  const updateCert = (idx, value) => {
    const updated = [...(form.certifications || [])];
    updated[idx] = value;
    setForm({ ...form, certifications: updated });
  };
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Skills & Certifications</h2>
      <div className="mb-4">
        <h3 className="font-semibold">Skills</h3>
        {(form.skills || []).map((skill, idx) => (
          <input key={idx} className="input mt-1" placeholder="Skill" value={skill} onChange={e => updateSkill(idx, e.target.value)} />
        ))}
        <button className="btn-primary mt-2" type="button" onClick={addSkill}>Add Skill</button>
      </div>
      <div>
        <h3 className="font-semibold">Certifications</h3>
        {(form.certifications || []).map((cert, idx) => (
          <input key={idx} className="input mt-1" placeholder="Certification" value={cert} onChange={e => updateCert(idx, e.target.value)} />
        ))}
        <button className="btn-primary mt-2" type="button" onClick={addCert}>Add Certification</button>
      </div>
    </div>
  );
}
