import React from "react";
export default function ResumeTemplateModern({ resume }) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-100 rounded-2xl p-8 text-gray-900 min-h-[600px] shadow-md">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <div>
          <h1 className="text-4xl font-bold text-blue-700">{resume.name || "Your Name"}</h1>
          <div className="text-md text-gray-600">{resume.email} | {resume.phone}</div>
        </div>
        <div className="mt-4 md:mt-0 text-right">
          <div className="text-sm text-blue-700">{resume.linkedin}</div>
          <div className="text-sm text-blue-700">{resume.github}</div>
        </div>
      </div>
      <h2 className="text-2xl font-semibold text-purple-700 mt-4 mb-1">Profile</h2>
      <p className="mb-4 italic">{resume.objective || "A motivated student seeking opportunities..."}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-semibold text-blue-700 mt-4 mb-1">Education</h2>
          <ul className="mb-4">
            {(resume.education || []).map((edu, i) => (
              <li key={i}>
                <strong>{edu.degree}</strong>, {edu.institution} ({edu.year})
              </li>
            ))}
          </ul>
          <h2 className="text-lg font-semibold text-blue-700 mt-4 mb-1">Skills</h2>
          <div className="mb-4 flex flex-wrap gap-2">
            {(resume.skills || []).map((skill, i) => (
              <span key={i} className="bg-blue-100 rounded px-2 py-1 text-sm text-blue-800">{skill}</span>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-blue-700 mt-4 mb-1">Projects</h2>
          <ul className="mb-4">
            {(resume.projects || []).map((proj, i) => (
              <li key={i}><strong>{proj.title}</strong>: {proj.description}</li>
            ))}
          </ul>
          <h2 className="text-lg font-semibold text-blue-700 mt-4 mb-1">Experience</h2>
          <ul className="mb-4">
            {(resume.experience || []).map((exp, i) => (
              <li key={i}><strong>{exp.role}</strong> at {exp.company} ({exp.period}): {exp.description}</li>
            ))}
          </ul>
        </div>
      </div>
      <h2 className="text-lg font-semibold text-purple-700 mt-4 mb-1">Certifications & Achievements</h2>
      <ul>
        {(resume.certifications || []).map((cert, i) => (
          <li key={i}>{cert}</li>
        ))}
      </ul>
    </div>
  );
}
