import { useRef, useEffect } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import radialSound from "../assets/Radial.mp3";
import "./Timer.css";

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

const TimerLabels = ({ name, setName }) => (
  <div className="timer-labels">
    <div className="label-row">
      <input
        type="text"
        className="timer-name-input"
        placeholder="Таймер"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </div>

    <div className="label-row">
      <div className="radius-select">
        <span>Радіус (типовий)</span>
        <div className="select-arrow">
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path d="M7 14l5 5 5-5H7z" />
            <path d="M7 10l5-5 5 5H7z" />
          </svg>
        </div>
      </div>
    </div>
  </div>
);

function Timer() {
  const [status, setStatus] = useLocalStorage("timer_status", "input");
  const [time, setTime] = useLocalStorage("timer_input_time", {
    hours: "00",
    minutes: "00",
    seconds: "00",
  });
  const [timerName, setTimerName] = useLocalStorage("timer_input_name", "");
  const [timeLeft, setTimeLeft] = useLocalStorage("timer_timeLeft", 0);
  const [initialTime, setInitialTime] = useLocalStorage("timer_initialTime", 0);
  const [isPaused, setIsPaused] = useLocalStorage("timer_isPaused", false);
  const [endTime, setEndTime] = useLocalStorage("timer_endTime", null);
  const idRef = useRef(null);

  const audioRef = useRef(new Audio(radialSound));

  useEffect(() => {
    audioRef.current.loop = true;
  }, []);

  useEffect(() => {
    return () => clearInterval(idRef.current);
  }, []);

  useEffect(() => {
    if (status === "running" && !isPaused && endTime) {
      const now = Date.now();
      const delta = endTime - now;
      if (delta > 0) {
        setTimeLeft(delta);
        startTimerInterval(endTime);
      } else {
        setStatus("input");
        setEndTime(null);
        setTimeLeft(0);
      }
    }
  }, []);

  function handleInputChange(e, field) {
    let value = e.target.value;

    if (value.length > 2) value = value.slice(0, 2);

    const numValue = parseInt(value);

    if (!isNaN(numValue) && numValue >= 0) {
      if (field !== "hours" && numValue > 59) return;
      setTime((prev) => ({ ...prev, [field]: value }));
    } else if (value === "") {
      setTime((prev) => ({ ...prev, [field]: "" }));
    }
  }

  const handleFocus = (e) => {
    e.target.select();
  };

  function startTimerInterval(targetTime) {
    clearInterval(idRef.current);
    idRef.current = setInterval(() => {
      const remaining = targetTime - Date.now();
      if (remaining <= 0) {
        clearInterval(idRef.current);
        setTimeLeft(0);
        setStatus("input");
        setIsPaused(false);
        setEndTime(null);
        audioRef.current
          .play()
          .catch((e) => console.log("Audio play failed:", e));
      } else {
        setTimeLeft(remaining);
      }
    }, 10);
  }

  function handleStart() {
    const hrs = parseInt(time.hours || 0) * 3600 * 1000;
    const mins = parseInt(time.minutes || 0) * 60 * 1000;
    const secs = parseInt(time.seconds || 0) * 1000;
    const totalDuration = hrs + mins + secs;

    if (totalDuration === 0) return;

    const deadline = Date.now() + totalDuration;

    setInitialTime(totalDuration);
    setStatus("running");
    setIsPaused(false);
    setTimeLeft(totalDuration);
    setEndTime(deadline);
    startTimerInterval(deadline);
  }

  function handleReset() {
    clearInterval(idRef.current);
    setStatus("input");
    setIsPaused(false);
    setTimeLeft(0);
    setInitialTime(0);
    setEndTime(null);
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  }

  function handlePause() {
    setIsPaused(true);
    clearInterval(idRef.current);
  }

  function handleResume() {
    setIsPaused(false);
    const deadline = Date.now() + timeLeft;
    setEndTime(deadline);
    startTimerInterval(deadline);
  }

  const radius = 190;
  const circumference = 2 * Math.PI * radius;
  const progress = initialTime > 0 ? timeLeft / initialTime : 0;
  const strokeDashoffset = circumference - progress * circumference;

  const finishTime = new Date(Date.now() + timeLeft);
  const timeString = finishTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="timer-container">
      {status === "input" && (
        <div className="timer-setup-view">
          <div className="time-picker-container">
            <div className="inputs-header">
              <span>год</span>
              <span>хв</span>
              <span>с</span>
            </div>

            <div className="timer-display-card">
              <div className="inputs-row">
                <input
                  type="number"
                  value={time.hours}
                  onChange={(e) => handleInputChange(e, "hours")}
                  onFocus={handleFocus}
                  placeholder="00"
                />
                <span className="separator">:</span>
                <input
                  type="number"
                  value={time.minutes}
                  onChange={(e) => handleInputChange(e, "minutes")}
                  onFocus={handleFocus}
                  placeholder="00"
                />
                <span className="separator">:</span>
                <input
                  type="number"
                  value={time.seconds}
                  onChange={(e) => handleInputChange(e, "seconds")}
                  onFocus={handleFocus}
                  placeholder="00"
                />
              </div>
            </div>
          </div>

          <TimerLabels name={timerName} setName={setTimerName} />

          <div className="timer-controls-bottom">
            <button className="btn-secondary" onClick={() => {}}>
              Скасувати
            </button>
            <button className="btn-primary start" onClick={handleStart}>
              Старт
            </button>
          </div>
        </div>
      )}

      {status === "running" && (
        <div className="timer-running-view">
          <div className="timer-circle-container">
            <svg width="420" height="420" viewBox="0 0 420 420">
              <circle
                cx="210"
                cy="210"
                r={radius}
                fill="none"
                stroke="#2c2c2e"
                strokeWidth="6"
              />
              <circle
                cx="210"
                cy="210"
                r={radius}
                fill="none"
                stroke="#ff9f0a"
                strokeWidth="6"
                strokeLinecap="round"
                transform="rotate(-90 210 210)"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>

            <div className="timer-text-overlay">
              <div className="bell-time">
                <span>🔔</span> {timeString}
              </div>
              <h1 className="timer-display-big">{formatTime(timeLeft)}</h1>
              <TimerLabels name={timerName} setName={setTimerName} />
            </div>
          </div>

          <div className="timer-controls-bottom">
            <button className="btn-secondary" onClick={handleReset}>
              Скасувати
            </button>
            {!isPaused ? (
              <button className="btn-warning" onClick={handlePause}>
                Пауза
              </button>
            ) : (
              <button className="btn-success" onClick={handleResume}>
                Продовжити
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Timer;
