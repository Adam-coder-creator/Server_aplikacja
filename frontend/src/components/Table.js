import React, { useEffect, useState } from "react";
import "./Table.css"; // Import stylów tabeli

function Table() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://backend:8000/data")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const generatePdf = () => {
    fetch("http://backend:8000/generate-pdf")
      .then((res) => res.blob())
      .then((blob) => {
        // Tworzenie linku do pobrania pliku PDF
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "session_data.pdf";
        link.click();
      })
      .catch((error) => console.error("Error generating PDF:", error));
  };

  return (
    <div className="table-container">
      <table>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.track_name}</td>
              <td>{item.laps_amount}</td>
              <td>{item.best_lap_time}</td>
              <td>{item.cold_pressure_lf}</td>
              <td>{item.cold_pressure_rf}</td>
              <td>{item.cold_pressure_lr}</td>
              <td>{item.cold_pressure_rr}</td>
              <td>{item.hot_pressure_lf}</td>
              <td>{item.hot_pressure_rf}</td>
              <td>{item.hot_pressure_lr}</td>
              <td>{item.hot_pressure_rr}</td>
              <td>{item.setup_description}</td>
              <td>{item.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={generatePdf} className="pdf-button">Generuj PDF</button>
    </div>
  );
}

export default Table;