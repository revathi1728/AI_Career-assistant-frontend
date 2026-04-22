import React, { useState } from "react";
import ResumePreview from "./ResumePreview";
import ResumeFormStepper from "./ResumeFormStepper";

export default function EResumeBuilder({ initialData, onSave }) {
  const [resume, setResume] = useState(initialData || {});
  const [activeTemplate, setActiveTemplate] = useState("simple");

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="flex-1 max-w-2xl">
        <ResumeFormStepper resume={resume} setResume={setResume} />
      </div>
      <div className="flex-1 max-w-2xl">
        <div className="mb-4 flex gap-2">
          <button onClick={() => setActiveTemplate("simple")}>Simple</button>
          <button onClick={() => setActiveTemplate("modern")}>Modern</button>
          <button onClick={() => setActiveTemplate("ats")}>ATS-friendly</button>
        </div>
        <ResumePreview resume={resume} template={activeTemplate} />
      </div>
    </div>
  );
}
