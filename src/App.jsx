import React, { useState, useRef } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import "./App.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title);

const transportModes = ["car", "REM", "metro", "bus", "walk", "bike"];
const creditRates = { walk: 5, bike: 4, metro: 2, bus: 2, REM: 1.5, car: 0.5 };

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [transportData, setTransportData] = useState({
    car: 0,
    REM: 0,
    metro: 0,
    bus: 0,
    walk: 0,
    bike: 0,
  });
  const [credits, setCredits] = useState(0);
  const [tracking, setTracking] = useState(false);
  const [currentMode, setCurrentMode] = useState(null);

  const intervalRef = useRef(null);
  const modeRef = useRef(null);

  const startTracking = () => {
    setTracking(true);
    switchMode();

    intervalRef.current = setInterval(() => {
      const distance = Math.random() * 5;
      setTransportData((prev) => ({
        ...prev,
        [modeRef.current]: prev[modeRef.current] + distance,
      }));
      setCredits((prev) => prev + distance * creditRates[modeRef.current]);
    }, 2000);

    intervalRef.modeSwitch = setInterval(switchMode, 6000);
  };

  const switchMode = () => {
    const mode =
      transportModes[Math.floor(Math.random() * transportModes.length)];
    modeRef.current = mode;
    setCurrentMode(mode);
  };

  const stopTracking = () => {
    clearInterval(intervalRef.current);
    clearInterval(intervalRef.modeSwitch);
    setTracking(false);
    setCurrentMode(null);
  };

  const toggleTracking = () => (tracking ? stopTracking() : startTracking());

  const redeemReward = (cost) => {
    if (credits >= cost) {
      setCredits((prev) => prev - cost);
      alert("Reward redeemed successfully!");
    } else {
      alert("Not enough credits!");
    }
  };

  const chartData = {
    labels: transportModes,
    datasets: [
      {
        label: "Kilometers Travelled",
        data: transportModes.map((m) => transportData[m]),
        backgroundColor: "rgba(0,123,255,0.7)",
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: { display: true, text: "Kilometers Travelled by Transport Mode" },
    },
    scales: { y: { beginAtZero: true } },
  };

  return (
    <div className="app-container">
      <nav>
        <button
          className={activeTab === "home" ? "active" : ""}
          onClick={() => setActiveTab("home")}
        >
          Home
        </button>
        <button
          className={activeTab === "dashboard" ? "active" : ""}
          onClick={() => setActiveTab("dashboard")}
        >
          Dashboard
        </button>
        <button
          className={activeTab === "rewards" ? "active" : ""}
          onClick={() => setActiveTab("rewards")}
        >
          Rewards
        </button>
      </nav>

      <main>
        {activeTab === "home" && (
          <section className="tab-section">
            <h2>Track Your Journey</h2>
            <p>
              {tracking
                ? `Tracking your ${currentMode} trip...`
                : "Press start to begin tracking."}
            </p>
            <button
              className={`track-btn ${tracking ? "stop-btn" : ""}`}
              onClick={toggleTracking}
            >
              {tracking ? "Stop Tracking" : "Start Tracking"}
            </button>
            {tracking && <div className="loader"></div>}
          </section>
        )}

        {activeTab === "dashboard" && (
          <section className="tab-section">
            <h2>Dashboard</h2>
            <div className="dashboard-container">
              <table>
                <thead>
                  <tr>
                    <th>Transport</th>
                    <th>Kilometers</th>
                  </tr>
                </thead>
                <tbody>
                  {transportModes.map((mode) => (
                    <tr key={mode}>
                      <td>{mode}</td>
                      <td>{transportData[mode].toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="chart-wrapper">
                <Bar data={chartData} options={chartOptions} />
              </div>
            </div>
          </section>
        )}

        {activeTab === "rewards" && (
          <section className="tab-section">
            <h2>Rewards</h2>
            <p>Credits: {credits.toFixed(1)}</p>
            <div className="reward-item">
              <h3>Free Coffee ☕</h3>
              <p>Cost: 50 credits</p>
              <button onClick={() => redeemReward(50)}>Redeem</button>
            </div>
            <div className="reward-item">
              <h3>Transit Passes 🎫</h3>
              <p>Cost: 120 credits</p>
              <button onClick={() => redeemReward(120)}>Redeem</button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
