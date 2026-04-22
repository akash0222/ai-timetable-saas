import { useState, useEffect } from "react";
import axios from "axios";
import Login from "./Login";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const API = import.meta.env.VITE_API;

export default function App() {

  // 🔐 Auth
  const [isAuth, setAuth] = useState(!!localStorage.getItem("token"));

  // ✅ ROLE (ADD HERE)
  const role = localStorage.getItem("role");

  // 📁 Data
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [timetable, setTimetable] = useState(null);
  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(false);

  // 📤 Upload Excel
  const uploadFile = async () => {
    if (role === "faculty") {
      alert("Faculty cannot upload ❌");
      return;
    }

    if (!file) return alert("Upload Excel first");

    const fd = new FormData();
    fd.append("file", file);

    try {
      setLoading(true);
      const res = await axios.post(`${API}/upload`, fd);
      setData(res.data);
      alert("File uploaded successfully ✅");
    } catch (err) {
      alert("Upload failed ❌");
    } finally {
      setLoading(false);
    }
  };

  // ⚙️ Generate Timetable
  const generate = async () => {
    if (role === "faculty") {
      alert("Faculty cannot generate timetable ❌");
      return;
    }

    if (data.length === 0) {
      alert("Upload data first");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${API}/generate`,
        { data },
        {
          headers: { Authorization: token }
        }
      );

      setTimetable(res.data.data);
      fetchHistory();

    } catch (err) {
      alert("Error generating timetable");
    } finally {
      setLoading(false);
    }
  };

  // 📜 Fetch History
  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API}/timetables`, {
        headers: { Authorization: token }
      });

      setHistory(res.data);

    } catch (err) {
      console.error(err);
    }
  };

  // 📄 PDF DOWNLOAD
  const downloadPDF = async () => {
    const element = document.getElementById("timetable");

    if (!element) {
      alert("No timetable found");
      return;
    }

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const width = 190;
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(imgData, "PNG", 10, 10, width, height);
    pdf.save("timetable.pdf");
  };

  // 🔄 Auto load history
  useEffect(() => {
    if (isAuth) {
      fetchHistory();
    }
  }, [isAuth]);

  // 🔐 Login Gate
  if (!isAuth) {
    return <Login setAuth={setAuth} />;
  }

  // 🚪 Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role"); // ✅ clear role also
    setAuth(false);
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Arial" }}>

      {/* Sidebar */}
      <div style={{
        width: "220px",
        background: "#1e293b",
        color: "#fff",
        padding: "20px"
      }}>
        <h2>📊 Dashboard</h2>
        <hr />
        <p style={{ marginTop: 20 }}>Timetable</p>
        <p>Upload Data</p>
        <p>History</p>

        <p style={{ marginTop: 20 }}>
          Role: <b>{role}</b>
        </p>

        <button 
          onClick={logout}
          style={{ marginTop: 20, background: "red", color: "#fff" }}
        >
          Logout
        </button>
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: "20px", background: "#f1f5f9" }}>

        {/* Header */}
        <div style={{
          background: "#fff",
          padding: "15px 20px",
          borderRadius: "10px",
          marginBottom: "20px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
        }}>
          <h2>AI Timetable Generator</h2>
        </div>

        {/* Upload */}
        <div style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "20px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
        }}>
          <h3>Upload Excel</h3>

          <input 
            type="file" 
            onChange={(e) => setFile(e.target.files[0])} 
          />

          <div style={{ marginTop: 10 }}>
            {/* ✅ DISABLED FOR FACULTY */}
            <button 
              onClick={uploadFile} 
              disabled={loading || role === "faculty"}
            >
              Upload
            </button>

            <button 
              onClick={generate} 
              style={{ marginLeft: 10 }}
              disabled={loading || role === "faculty"}
            >
              Generate
            </button>

            <button 
              onClick={fetchHistory}
              style={{ marginLeft: 10 }}
            >
              Refresh History
            </button>
          </div>
        </div>

        {/* Timetable */}
        {timetable && (
          <div
            id="timetable"
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
            }}
          >
            <h3>Generated Timetable</h3>

            <button 
              onClick={downloadPDF}
              style={{ marginBottom: 10, background: "#2563eb", color: "#fff" }}
            >
              Download PDF
            </button>

            <table border="1" cellPadding="10" style={{ width: "100%", marginTop: 10 }}>
              <thead style={{ background: "#e2e8f0" }}>
                <tr>
                  <th>Day</th>
                  <th>S1</th>
                  <th>S2</th>
                  <th>S3</th>
                  <th>S4</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(timetable).map(day => (
                  <tr key={day}>
                    <td><b>{day}</b></td>
                    {Object.values(timetable[day]).map((slot, i) => (
                      <td key={i}>{slot}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* History */}
        {history.length > 0 && (
          <div style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "10px",
            marginTop: "20px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
          }}>
            <h3>Saved Timetables</h3>

            {history.map((item, i) => (
              <div key={i} style={{ marginBottom: 15 }}>
                <b>Timetable {i + 1}</b>
                <pre style={{ fontSize: "12px" }}>
                  {JSON.stringify(item.data, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}