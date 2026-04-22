import React from "react";
export default function ResumeTemplateSimple({ resume }) {
  return (
    <div className="bg-white border rounded p-6 text-gray-900 min-h-[600px]">
      <h1 className="text-3xl font-bold">{resume.name || "Your Name"}</h1>
      <div className="text-sm text-gray-600 mb-2">{resume.email} | {resume.phone} | {resume.linkedin} | {resume.github}</div>
      <h2 className="text-xl font-semibold mt-4 mb-1">Career Objective</h2>
      <p className="mb-4">{resume.objective || "A brief career summary goes here."}</p>
      <h2 className="text-xl font-semibold mt-4 mb-1">Education</h2>
      <ul className="mb-4">
        {(resume.education || []).map((edu, i) => (
          <li key={i}>
            <strong>{edu.degree}</strong>, {edu.institution} ({edu.year})
          </li>
        ))}
      </ul>
      <h2 className="text-xl font-semibold mt-4 mb-1">Skills</h2>
      <div className="mb-4 flex flex-wrap gap-2">
        {(resume.skills || []).map((skill, i) => (
          <span key={i} className="bg-gray-200 rounded px-2 py-1 text-sm">{skill}</span>
        ))}
      </div>
      <h2 className="text-xl font-semibold mt-4 mb-1">Projects</h2>
      <ul className="mb-4">
        {(resume.projects || []).map((proj, i) => (
          <li key={i}><strong>{proj.title}</strong>: {proj.description}</li>
        ))}
      </ul>
      <h2 className="text-xl font-semibold mt-4 mb-1">Experience</h2>
      <ul className="mb-4">
        {(resume.experience || []).map((exp, i) => (
          <li key={i}><strong>{exp.role}</strong> at {exp.company} ({exp.period}): {exp.description}</li>
        ))}
      </ul>
      <h2 className="text-xl font-semibold mt-4 mb-1">Certifications & Achievements</h2>
      <ul>
        {(resume.certifications || []).map((cert, i) => (
          <li key={i}>{cert}</li>
        ))}
      </ul>
    </div>
  );
}
