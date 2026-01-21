import { useState, useRef } from "react";
import "../App.css";

function formattedTime(time) {
  const minutes = Math.floor(time / 60000);
  const seconds = Math.floor((time / 1000) % 60);
  const milliseconds = Math.floor((time % 1000) / 10);

  const fMinutes = minutes.toString().padStart(2, "0");
  const fSeconds = seconds.toString().padStart(2, "0");
  const fMilliseconds = milliseconds.toString().padStart(2, "0");

  return `${fMinutes}:${fSeconds},${fMilliseconds}`;
}

export default function Stopwatch() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState([]);

  const idRef = useRef(null);
  const startTimeRef = useRef(0);

  function handleStart() {
    if (isRunning) return;
    setIsRunning(true);
    startTimeRef.current = Date.now() - time;

    idRef.current = setInterval(() => {
      setTime(Date.now() - startTimeRef.current);
    }, 10);
  }

  function handleStop() {
    if (!isRunning) return;
    setIsRunning(false);
    clearInterval(idRef.current);
  }

  function handleReset() {
    setIsRunning(false);
    clearInterval(idRef.current);
    setTime(0);
    setLaps([]);
  }

  function handleLap() {
    setLaps([...laps, time]);
  }

  return (
    <div className="app-container">
      {/* Таймер */}
      <div className="timer-section">
        <div className="timer-display">{formattedTime(time)}</div>
      </div>

      {/*  Таблиця кіл */}
      <div className="laps-container">
        {/* Заголовок таблиці */}
        <div className="laps-header">
          <span>№ кола</span>
          <span>Час кола</span>
          <span>Усього</span>
        </div>

        {/* Список  */}
        <div className="laps-list">
          {[...laps].reverse().map((totalTime, index) => {
            const realIndex = laps.length - index;
            const prevTotalTime = laps[realIndex - 2] || 0;
            const lapDuration = totalTime - prevTotalTime;

            return (
              <div key={realIndex} className="lap-item">
                <span>Коло {realIndex}</span>
                <span>{formattedTime(lapDuration)}</span>
                <span>{formattedTime(totalTime)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/*  Кнопки */}
      <div className="btn-container">
        {/* Ліва кнопка: Reset або Lap */}
        {!isRunning ? (
          <button
            className="btn-secondary"
            disabled={time === 0}
            onClick={handleReset}
          >
            На нуль
          </button>
        ) : (
          <button className="btn-secondary" onClick={handleLap}>
            Коло
          </button>
        )}

        {/* Права кнопка: Start або Stop */}
        {!isRunning ? (
          <button className="btn-primary start" onClick={handleStart}>
            Старт
          </button>
        ) : (
          <button className="btn-primary stop" onClick={handleStop}>
            Стоп
          </button>
        )}
      </div>
    </div>
  );
}
