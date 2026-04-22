import React from "react";
import ResumeTemplateSimple from "./ResumeTemplateSimple";
import ResumeTemplateModern from "./ResumeTemplateModern";
import ResumeTemplateATS from "./ResumeTemplateATS";

export default function ResumePreview({ resume, template }) {
  if (template === "modern") return <ResumeTemplateModern resume={resume} />;
  if (template === "ats") return <ResumeTemplateATS resume={resume} />;
  return <ResumeTemplateSimple resume={resume} />;
}
