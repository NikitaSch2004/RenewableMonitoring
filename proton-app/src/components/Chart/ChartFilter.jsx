import { useState } from 'react';
import DatePick from './DatePick';

export default function ChartFilter({ onApply }) {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const isInvalidRange = startDate && endDate && new Date(endDate) < new Date(startDate);

    function handleApply() {
        if (!isInvalidRange) {
            onApply({ start: startDate, end: endDate });
        }
    }

    return (
        <div className="flex items-center space-x-4">
            <div>
                <DatePick
                    label="Start date"
                    value={startDate}
                    onChange={(newValue) => setStartDate(newValue)}
                    maxDate={endDate}
                />
            </div>
            <div>
                <DatePick
                    label="End date"
                    value={endDate}
                    onChange={(newValue) => setEndDate(newValue)}
                    minDate={startDate}
                />
            </div>
            <div>
                <button
                    onClick={handleApply}
                    disabled={isInvalidRange}
                    className={`text-white font-bold py-2 px-4 rounded-lg transition-colors text-lg ${isInvalidRange ? "bg-gray-400" : "bg-yellow-400 hover:bg-yellow-500"}`}
                >
                    Load
                </button>
            </div>
        </div>
    );
}
