import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [visitors, setVisitors] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [startDate, setStartDate] = useState(""); // Isang date lang ititira natin
  const [searchTerm, setSearchTerm] = useState("");
  const [reasonFilter, setReasonFilter] = useState("");
  const [collegeFilter, setCollegeFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, "visitors"));
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        dateObj: doc.data().timestamp?.toDate() || null
      }));
      setVisitors(data);
      setFiltered(data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    let result = visitors;

    // Isang date filter na lang: matches the specific day
    if (startDate) {
      const selectedDate = new Date(startDate).toDateString();
      result = result.filter(v => v.dateObj?.toDateString() === selectedDate);
    }

    if (searchTerm) {
      result = result.filter(v =>
        v.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.reason?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (reasonFilter) {
      result = result.filter(v => v.reason === reasonFilter);
    }

    if (collegeFilter) {
      result = result.filter(v => v.program === collegeFilter);
    }

    if (roleFilter) {
      result = result.filter(v => v.role === roleFilter);
    }

    setFiltered(result);
  }, [visitors, startDate, searchTerm, reasonFilter, collegeFilter, roleFilter]);

  const downloadPDF = () => {
  try {
    const doc = new jsPDF();
    
    // Header ng PDF
    doc.setFontSize(18);
    doc.text("NEU Library Visitor Log Report", 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);

    // Dito tinatawag ang autoTable nang direkta (Safe Way)
    autoTable(doc, {
      startY: 30,
      head: [['Name', 'Email', 'Program', 'Reason', 'Role', 'Date/Time']],
      body: filtered.map(v => [
        v.name || "N/A",
        v.email || "N/A",
        v.program || "N/A",
        v.reason || "N/A",
        v.role || "N/A",
        v.dateObj ? v.dateObj.toLocaleString() : "N/A"
      ]),
      theme: 'grid', // Para magmukhang professional kay Prof
      headStyles: { fillColor: [30, 41, 59] }, // Dark slate header
    });

    doc.save("NEU-Library-Report.pdf");
  } catch (err) {
    console.error("PDF Error:", err);
    alert("May error sa pag-generate ng PDF. Check console.");
  }
};

  return (
    <div className="dashboard">
      <h1>Admin Dashboard</h1>

      <div className="filter-section">
        {/* TINANGGAL ANG ISANG DATE INPUT DITO */}
        <input 
          type="date" 
          onChange={e => setStartDate(e.target.value)} 
        />
        
        <input 
          type="text" 
          placeholder="Search Name or Reason..." 
          onChange={e => setSearchTerm(e.target.value)} 
        />
        <select onChange={e => setReasonFilter(e.target.value)}>
          <option value="">All Reasons</option>
          <option value="Reading">Reading</option>
          <option value="Research">Research</option>
          <option value="Meeting">Meeting</option>
          <option value="Printing">Printing</option>
          <option value="Computer Use">Computer Use</option>
        </select>
        <select onChange={e => setCollegeFilter(e.target.value)}>
          <option value="">All Colleges</option>
          <option value="BSIT">BS in Information Technology</option>
          <option value="BSCS">BS in Computer Science</option>
          <option value="BSIS">BS in Information System</option>
          <option value="BSCE">BS in Civil Engineering</option>
          <option value="BSEE">BS in Electrical Engineering</option>
          <option value="BSME">BS in Mechanical Engineering</option>
        </select>
        <select onChange={e => setRoleFilter(e.target.value)}>
          <option value="">All Roles</option>
          <option value="Student">Student</option>
          <option value="Teacher">Teacher</option>
          <option value="Staff">Staff</option>
        </select>
        <button onClick={downloadPDF} style={{backgroundColor: '#d32f2f', color: 'white'}}>Export PDF</button>
      </div>

      <div className="stats-container">
        <div className="card">
          <h3>Total Visitors</h3>
          <p>{filtered.length}</p>
        </div>
        <div className="card">
          <h3>Students</h3>
          <p>{filtered.filter(v => v.role === "Student").length}</p>
        </div>
        <div className="card">
          <h3>Teachers</h3>
          <p>{filtered.filter(v => v.role === "Teacher").length}</p>
        </div>
        <div className="card">
          <h3>Staff</h3>
          <p>{filtered.filter(v => v.role === "Staff").length}</p>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Program</th>
            <th>Reason</th>
            <th>Role</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(v => (
            <tr key={v.id}>
              <td>{v.name}</td>
              <td>{v.email}</td>
              <td>{v.program || "N/A"}</td>
              <td>{v.reason}</td>
              <td>{v.role || "N/A"}</td>
              <td>{v.dateObj ? v.dateObj.toLocaleString() : "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}