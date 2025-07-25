import { useState, useEffect } from 'react';
import DatePick from './DatePick';
import dayjs from 'dayjs';

export default function ChartFilter({ onApply, selectedDate, loading }) {
  const [localMode, setLocalMode] = useState("day");
  const [localDate, setLocalDate] = useState(dayjs());

  // Синхронизируем локальное состояние с пропсами при изменении selectedDate
  useEffect(() => {
    if (selectedDate?.date) {
      setLocalDate(selectedDate.date);
      if (selectedDate.mode) {
        setLocalMode(selectedDate.mode);
      }
    }
  }, [selectedDate]);

  const handleModeChange = (newMode) => {
    setLocalMode(newMode);
    if (localDate) {
      onApply({ mode: newMode, date: localDate });
    }
  };

  const handleDateChange = (newDate) => {
    setLocalDate(newDate);
    if (newDate) {
      onApply({ mode: localMode, date: newDate });
    }
  };

  return (
    <div className="flex space-x-4">
      <div className="flex gap-2">
        {["day", "month", "year"].map((m) => (
          <button
            key={m}
            onClick={() => handleModeChange(m)}
            disabled={loading}
            className={`w-full font-bold py-2 px-4 rounded-lg transition-colors text-lg border ${
              localMode === m
                ? "bg-yellow-400 text-white hover:bg-yellow-500"
                : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
            } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>

      <DatePick
        mode={localMode}
        value={localDate}
        onChange={handleDateChange}
        disabled={loading}
      />
    </div>
  );
}