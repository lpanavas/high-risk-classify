import React, { useState, useEffect } from "react";
import Select from "react-select";
import "./App.css";
import inputData from "./data/VAIR.json";
import highRiskCombinations from "./data/highRiskCombinations.json";
import unacceptableRisk from "./data/unacceptableRisk.json";
import purposeToDomain from "./data/purposeToDomain.json";

// Get options for select input from data
function getOptions(data, prefix) {
  return data.map((option) => ({
    value: option,
    label: option,
  }));
}

function App() {
  const [AI_domain, setAI_domain] = useState(null);
  const [AI_purpose, setAI_purpose] = useState(null);
  const [AI_capability, setAI_capability] = useState(null);
  const [AI_user, setAI_user] = useState(null);
  const [AI_subject, setAI_subject] = useState(null);

  useEffect(() => {
    if (AI_purpose) {
      purposeToDomain.forEach((rule) => {
        let matched = true; // assumption that the rule will match

        if (
          rule.purpose &&
          (!AI_purpose || AI_purpose.value !== rule.purpose)
        ) {
          matched = false;
        }
        if (
          rule.AI_subject &&
          (!AI_subject || AI_subject.value !== rule.AI_subject)
        ) {
          matched = false;
        }
        if (rule.AI_user && (!AI_user || AI_user.value !== rule.AI_user)) {
          matched = false;
        }
        if (
          rule.AI_capability &&
          (!AI_capability || AI_capability.value !== rule.AI_capability)
        ) {
          matched = false;
        }

        if (matched) {
          setAI_domain({ value: rule.domain, label: rule.domain });
        }
      });
    }
  }, [AI_purpose, AI_subject, AI_user, AI_capability]);

  const checkSystem = () => {
    const userInput = {
      domain: "Any",
      purpose: AI_purpose.value,
      AI_capability: AI_capability.value,
      AI_user: AI_user.value,
      AI_subject: AI_subject.value,
    };

    // First, look for exact match in highRiskCombinations
    for (let i = 0; i < highRiskCombinations.length; i++) {
      let combination = highRiskCombinations[i].semanticModel;
      let isMatch = true;
      for (let key in combination) {
        if (combination[key] !== userInput[key]) {
          isMatch = false;
          break;
        }
      }
      if (isMatch) {
        return "High risk";
      }
    }

    // Then, look for exact match in unacceptableRisk array
    for (let i = 0; i < unacceptableRisk.length; i++) {
      let combination = unacceptableRisk[i].semanticModel;
      let isMatch = true;
      for (let key in combination) {
        if (combination[key] !== userInput[key]) {
          isMatch = false;
          break;
        }
      }
      if (isMatch) {
        return "Unacceptable risk";
      }
    }
    for (let i = 0; i < unacceptableRisk.length; i++) {
      let combination = unacceptableRisk[i].semanticModel;
      let isMatch = true;
      for (let key in combination) {
        if (
          key !== "domain" &&
          combination[key] !== "Any" &&
          combination[key] !== userInput[key]
        ) {
          isMatch = false;
          break;
        }
      }
      if (isMatch) {
        return "Unacceptable risk";
      }
    }

    // Now, look for partial match with "Any" in highRiskCombinations
    for (let i = 0; i < highRiskCombinations.length; i++) {
      let combination = highRiskCombinations[i].semanticModel;
      let isMatch = true;
      for (let key in combination) {
        if (
          key !== "domain" &&
          combination[key] !== "Any" &&
          combination[key] !== userInput[key]
        ) {
          isMatch = false;
          break;
        }
      }
      if (isMatch) {
        return "High risk";
      }
    }

    // Finally, look for partial match with "Any" in unacceptableRisk array

    // If no match found in any case, return "Low risk"
    return "Low risk";
  };

  return (
    <div className="App">
      <h3>
        Please choose a purpose for the AI. All fields are required. The button
        to check the system will only appear after all options have been chosen.
      </h3>
      <h4>Domain</h4>
      <Select
        className="select"
        placeholder="Select Domain"
        onChange={setAI_domain}
        value={AI_domain}
        options={getOptions(inputData.Domain)}
        isSearchable
        isClearable
        required
      />

      <h4>Purpose</h4>
      <Select
        className="select"
        placeholder="Select Purpose"
        onChange={setAI_purpose}
        value={AI_purpose}
        options={getOptions(inputData.Purposes)}
        isSearchable
        isClearable
        required
      />

      <h4>Capability</h4>
      <Select
        className="select"
        placeholder="Select Capability"
        onChange={setAI_capability}
        value={AI_capability}
        options={getOptions(inputData.Capabilities)}
        isSearchable
        isClearable
        required
      />

      <h4>User</h4>
      <Select
        className="select"
        placeholder="Select User"
        onChange={setAI_user}
        value={AI_user}
        options={getOptions(inputData.Stakeholders)}
        isSearchable
        isClearable
        required
      />

      <h4>Subject</h4>
      <Select
        className="select"
        placeholder="Select Subject"
        onChange={setAI_subject}
        value={AI_subject}
        options={getOptions(inputData.Stakeholders)}
        isSearchable
        isClearable
        required
      />

      {AI_purpose && AI_domain && AI_capability && AI_user && AI_subject && (
        <button onClick={() => alert(checkSystem())}>Check</button>
      )}
    </div>
  );
}
export default App;
