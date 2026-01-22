import { useState } from "react";
import Stopwatch from "./components/Stopwatch";
import Timer from "./components/Timer";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("stopwatch");

  return (
    <div className="main-layout">
      {/* Навігація */}
      <div className="app-header">
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
            Таймери
          </button>
        </div>
      </div>

      {/* Умовний рендеринг */}
      <div className="content-area">
        {activeTab === "stopwatch" && <Stopwatch />}
        {activeTab === "timer" && <Timer />}
      </div>
    </div>
  );
}

export default App;
