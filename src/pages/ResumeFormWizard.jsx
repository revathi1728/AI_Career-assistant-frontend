import React, { useState } from "react";
import PersonalInfoForm from "./steps/PersonalInfoForm";
import EducationForm from "./steps/EducationForm";
import ExperienceForm from "./steps/ExperienceForm";
import SkillsCertsForm from "./steps/SkillsCertsForm";
import ReviewSubmitForm from "./steps/ReviewSubmitForm";

const steps = [
  PersonalInfoForm,
  EducationForm,
  ExperienceForm,
  SkillsCertsForm,
  ReviewSubmitForm
];

export default function ResumeFormWizard({ initialData, onSubmit }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialData || {});
  const StepComponent = steps[step];
  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <StepComponent form={form} setForm={setForm} />
      <div className="flex justify-between mt-4">
        {step > 0 && <button className="btn-secondary" onClick={() => setStep(step - 1)}>Back</button>}
        {step < steps.length - 1 ? (
          <button className="btn-primary" onClick={() => setStep(step + 1)}>Next</button>
        ) : (
          <button className="btn-primary" onClick={() => onSubmit(form)}>Submit</button>
        )}
      </div>
      <div className="mt-2 text-center text-gray-500">Step {step + 1} of {steps.length}</div>
    </div>
  );
}
