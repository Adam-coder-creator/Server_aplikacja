import React, { useState } from "react";
import "./Form.css"; // Dodaj style dla wizualizacji samochodu

function Form() {
  const [formData, setFormData] = useState({
    track_name: "",
    laps_amount: "",
    best_lap_time: "",
    cold_pressure_lf: "",
    cold_pressure_rf: "",
    cold_pressure_lr: "",
    cold_pressure_rr: "",
    hot_pressure_lf: "",
    hot_pressure_rf: "",
    hot_pressure_lr: "",
    hot_pressure_rr: "",
    setup_description: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      const parsedData = {
        ...formData,
        laps_amount: parseInt(formData.laps_amount, 10),
        best_lap_time: formData.best_lap_time ? parseFloat(formData.best_lap_time) : null,
        cold_pressure_lf: parseFloat(formData.cold_pressure_lf),
        cold_pressure_rf: parseFloat(formData.cold_pressure_rf),
        cold_pressure_lr: parseFloat(formData.cold_pressure_lr),
        cold_pressure_rr: parseFloat(formData.cold_pressure_rr),
        hot_pressure_lf: parseFloat(formData.hot_pressure_lf),
        hot_pressure_rf: parseFloat(formData.hot_pressure_rf),
        hot_pressure_lr: parseFloat(formData.hot_pressure_lr),
        hot_pressure_rr: parseFloat(formData.hot_pressure_rr),
        setup_description: formData.setup_description,
      };

      fetch("http://localhost:8000/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedData),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to create session");
          return res.blob();
        })
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "session_data.pdf";
          a.click();
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } catch (err) {
      console.error("Parsing error:", err);
    };

    setFormData({
      track_name: "",
      laps_amount: "",
      best_lap_time: "",
      cold_pressure_lf: "",
      cold_pressure_rf: "",
      cold_pressure_lr: "",
      cold_pressure_rr: "",
      hot_pressure_lf: "",
      hot_pressure_rf: "",
      hot_pressure_lr: "",
      hot_pressure_rr: "",
      setup_description: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2>GOKART SETUP</h2>

      {/* Sekcja nad wizualizacją samochodu */}
      <div className="general-inputs">
        <div>
          <label>Track name</label>
          <input
            type="text"
            name="track_name"
            value={formData.track_name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Laps amount</label>
          <input
            type="text"
            name="laps_amount"
            value={formData.laps_amount}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Best Lap Time</label>
          <input
            type="text"
            name="best_lap_time"
            value={formData.best_lap_time}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Wizualizacja samochodu */}
      <div className="car-visualization">
        <div className="pressure-input front-left">
          <label>Cold Pressure LF</label>
          <input
            type="text"
            name="cold_pressure_lf"
            value={formData.cold_pressure_lf}
            onChange={handleChange}
          />
          <label>Hot Pressure LF</label>
          <input
            type="text"
            name="hot_pressure_lf"
            value={formData.hot_pressure_lf}
            onChange={handleChange}
          />
        </div>
        <div className="pressure-input front-right">
          <label>Cold Pressure RF</label>
          <input
            type="text"
            name="cold_pressure_rf"
            value={formData.cold_pressure_rf}
            onChange={handleChange}
          />
          <label>Hot Pressure RF</label>
          <input
            type="text"
            name="hot_pressure_rf"
            value={formData.hot_pressure_rf}
            onChange={handleChange}
          />
        </div>
        <div className="pressure-input rear-left">
          <label>Cold Pressure LR</label>
          <input
            type="text"
            name="cold_pressure_lr"
            value={formData.cold_pressure_lr}
            onChange={handleChange}
          />
          <label>Hot Pressure LR</label>
          <input
            type="text"
            name="hot_pressure_lr"
            value={formData.hot_pressure_lr}
            onChange={handleChange}
          />
        </div>
        <div className="pressure-input rear-right">
          <label>Cold Pressure RR</label>
          <input
            type="text"
            name="cold_pressure_rr"
            value={formData.cold_pressure_rr}
            onChange={handleChange}
          />
          <label>Hot Pressure RR</label>
          <input
            type="text"
            name="hot_pressure_rr"
            value={formData.hot_pressure_rr}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Pole setup_description pod wizualizacją */}
      <div className="setup-description">
        <label>Setup Description</label>
        <textarea
          name="setup_description"
          value={formData.setup_description}
          onChange={handleChange}
        />
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}

export default Form;
