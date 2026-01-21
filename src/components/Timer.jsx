import { useRef, useState } from "react";

function formatTime(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  const fHours = hours.toString().padStart(2, "0");
  const fMinutes = minutes.toString().padStart(2, "0");
  const fSeconds = seconds.toString().padStart(2, "0");

  return `${fHours}:${fMinutes}:${fSeconds}`;
}

function Timer() {
  const [time, setTime] = useState({
    hours: "00",
    minutes: "00",
    seconds: "00",
  });
  const [status, setStatus] = useState("input");
  const [timeLeft, setTimeLeft] = useState(0);
  const endTimeRef = useRef(null);
  const idRef = useRef(null);
  const [initialTime, setInitialTime] = useState(0);

  function handleInputChange(e, field) {
    const value = e.target.value;

    if (value === "") {
      setTime((prev) => ({ ...prev, [field]: "" }));
      return;
    }

    const numValue = parseInt(value);
    if (isNaN(numValue) || numValue < 0) return;

    if (field !== "hours" && numValue > 59) return;

    if (value.length > 2) return;

    setTime((prev) => {
      return { ...prev, [field]: value };
    });
  }

  function handleStart() {
    const hrs = parseInt(time.hours || 0) * 3600 * 1000;
    const mins = parseInt(time.minutes || 0) * 60 * 1000;
    const secs = parseInt(time.seconds || 0) * 1000;

    const totalDuration = hrs + mins + secs;
    setInitialTime(totalDuration);
    if (totalDuration === 0) return;

    setStatus("running");
    setTimeLeft(totalDuration);

    endTimeRef.current = totalDuration + Date.now();
    idRef.current = setInterval(() => {
      const remaining = endTimeRef.current - Date.now();
      if (remaining <= 0) {
        clearInterval(idRef.current);
        setTimeLeft(0);
        setStatus("input");
        alert("time is over");
      } else {
        setTimeLeft(remaining);
      }
    }, 10);
  }

  function handleReset() {
    clearInterval(idRef.current);
    setStatus("input");
  }
  return (
    <div className="timer-container">
      {status === "input" && (
        <div className="timer-setup">
          <div className="inputs-row">
            {/* Блок Годин */}
            <div className="input-group">
              <label>год</label>
              <input
                type="number"
                value={time.hours}
                onChange={(e) => handleInputChange(e, "hours")}
                placeholder="00"
              />
            </div>

            <span className="separator">:</span>

            {/* Блок Хвилин */}
            <div className="input-group">
              <label>хв</label>
              <input
                type="number"
                value={time.minutes}
                onChange={(e) => handleInputChange(e, "minutes")}
                placeholder="00"
              />
            </div>

            <span className="separator">:</span>

            {/* Блок Секунд */}
            <div className="input-group">
              <label>сек</label>
              <input
                type="number"
                value={time.seconds}
                onChange={(e) => handleInputChange(e, "seconds")}
                placeholder="00"
              />
            </div>
          </div>

          {/* Кнопка Старт */}
          <div className="btn-container">
            <button className="btn-primary start" onClick={handleStart}>
              Старт
            </button>
          </div>
        </div>
      )}
      {status === "running" && (
        <div className="timer-running">
          <h1 className="timer-display">{formatTime(timeLeft)}</h1>
          <div className="btn-container">
            {/* Підключаємо кнопку до функції скидання */}
            <button className="btn-secondary" onClick={handleReset}>
              Скасувати
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Timer;
