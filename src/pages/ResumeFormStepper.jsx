import React, { useState } from "react";

const steps = [
  "Personal Details",
  "Career Objective",
  "Education",
  "Skills",
  "Projects",
  "Experience",
  "Certifications"
];

export default function ResumeFormStepper({ resume, setResume }) {
  const [step, setStep] = useState(0);

  // ...render step forms based on step index (to be implemented)
  return (
    <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
      <div className="flex gap-2 mb-6">
        {steps.map((label, idx) => (
          <button
            key={label}
            className={`px-3 py-1 rounded ${step === idx ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => setStep(idx)}
          >
            {label}
          </button>
        ))}
      </div>
      {/* TODO: Render step forms here */}
      <div className="mt-4">Step {step + 1} of {steps.length}</div>
    </div>
  );
}
