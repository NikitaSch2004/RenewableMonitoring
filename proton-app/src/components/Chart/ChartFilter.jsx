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

  const handleApply = () => {
    if (localDate) {
      onApply({ mode: localMode, date: localDate });
    }
  };

  return (
    <div className="flex space-x-4">
      <div className="flex gap-2">
        {["day", "month", "year"].map((m) => (
          <button
            key={m}
            onClick={() => setLocalMode(m)}
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
        onChange={setLocalDate}
        disabled={loading}
      />

      <button
        onClick={handleApply}
        disabled={!localDate || loading}
        className={`font-bold py-2 px-4 rounded-lg transition-colors text-lg bg-green-600 text-white hover:bg-green-700 ml-2 ${
          (!localDate || loading) ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Loading..." : "Apply"}
      </button>
    </div>
  );
}