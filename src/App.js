import React, { useState } from "react";
import VisitorLoginPage from "./VisitorLogin";
import VisitorForm from "./VisitorForm";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";

// 🔥 firebase auth
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const auth = getAuth();
const provider = new GoogleAuthProvider();

export default function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);

  // 🔥 NEW: visitor form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [program, setProgram] = useState("");
  const [reason, setReason] = useState("");

  // 🔥 visitor login handler
  const handleUserLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const loggedUser = result.user;

      // ✅ NEU email only
      if (!loggedUser.email.endsWith("@neu.edu.ph")) {
        alert("NEU email only!");
        return;
      }

      setUser(loggedUser);
      setPage("visitor");

    } catch (error) {
      console.error(error);
    }
  };

  // 🔥 visitor form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const visitorData = {
      name,
      email,
      program,
      reason,
    };
    console.log(visitorData); // 🔥 dito mo puwede i-send sa Firebase
    alert("Visitor data submitted! Check console for details.");

    // clear form after submit
    setName("");
    setEmail("");
    setProgram("");
    setReason("");
  };

  // ===== RENDER PAGES =====
  if (page === "home") {
    return (
      <VisitorLoginPage
        onUser={handleUserLogin}
        onAdmin={() => setPage("adminLogin")}
      />
    );
  }

  if (page === "visitor") {
    return (
      <VisitorForm
        user={user}           // logged-in user
        name={name}
        setName={setName}
        email={email}
        setEmail={setEmail}
        program={program}     // ✅ program state
        setProgram={setProgram}
        reason={reason}
        setReason={setReason}
        handleSubmit={handleSubmit}
      />
    );
  }

  if (page === "adminLogin") {
    return (
      <AdminLogin
        onLogin={(u) => {
          setUser(u);
          setPage("adminDashboard");
        }}
      />
    );
  }

  if (page === "adminDashboard") {
    return <AdminDashboard user={user} />;
  }

  return null;
}