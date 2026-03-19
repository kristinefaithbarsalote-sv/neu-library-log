import React, { useState } from "react";
import { db } from "./firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import "./VisitorForm.css";

export default function VisitorForm({ user }) {
  const [reason, setReason] = useState("");
  const [other, setOther] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [program, setProgram] = useState(""); // ✅ program state
  const [role, setRole] = useState("");       // ✅ role state

  const reasons = ["Reading", "Researching", "Computer Use", "Meeting"];
  const roles = ["Student", "Teacher", "Staff"]; // Options for role

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalReason = reason === "Other" ? other : reason;

    // safety checks
    const name = user?.displayName || "Guest";
    const email = user?.email || null;

    if (!finalReason) {
      alert("Please select or enter a reason");
      return;
    }

    if (!program) {
      alert("Please enter your program");
      return;
    }

    if (!role) {
      alert("Please select your role");
      return;
    }

    await addDoc(collection(db, "visitors"), {
      name: name,
      email: email,
      program: program,      // ✅ save program to Firestore
      reason: finalReason,   // ✅ save reason
      role: role,            // ✅ save role
      timestamp: Timestamp.now(), // ✅ timestamp
    });

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="container">
        <h2>Welcome to NEU Library!</h2>
        <p>Name: {user.displayName}</p>
        <p>Email: {user.email}</p>
        <p>Program: {program}</p>
        <p>Role: {role}</p>               {/* ✅ Show Role */}
        <p>Reason: {reason === "Other" ? other : reason}</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Enter Your Program</h2>
      <input
        type="text"
        placeholder="Program"
        value={program}
        onChange={(e) => setProgram(e.target.value)}
        required
      />

      <h2>Select Your Role</h2>
      <select value={role} onChange={(e) => setRole(e.target.value)} required>
        <option value="">Select Role</option>
        {roles.map(r => (
          <option key={r} value={r}>{r}</option>
        ))}
      </select>

      <h2>Select Reason</h2>
      <div className="options-grid">
        {reasons.map((r) => (
          <div
            key={r}
            className={`option-box ${reason === r ? "selected" : ""}`}
            onClick={() => setReason(r)}
          >
            {r}
          </div>
        ))}

        <div
          className={`option-box ${reason === "Other" ? "selected" : ""}`}
          onClick={() => setReason("Other")}
        >
          Other
        </div>
      </div>

      {reason === "Other" && (
        <input
          type="text"
          placeholder="Enter reason"
          value={other}
          onChange={(e) => setOther(e.target.value)}
        />
      )}

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}