import { useState } from "react";
import Stopwatch from "./components/Stopwatch";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("stopwatch");

  return (
    <div className="app-container">
      {/* Навігація */}
      <div className="tab-navigation">
        <button
          className={activeTab === "stopwatch" ? "tab active" : "tab"}
          onClick={() => setActiveTab("stopwatch")}
        >
          Секундомір
        </button>
        <button
          className={activeTab === "timer" ? "tab active" : "tab"}
          onClick={() => setActiveTab("timer")}
        >
          Таймер
        </button>
      </div>

      {/* Умовний рендеринг */}
      <div className="content-area">
        {activeTab === "stopwatch" && <Stopwatch />}
        {activeTab === "timer" && (
          <div style={{ color: "white", marginTop: "50px" }}>
            Тут буде Таймер
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
