import {
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Area, AreaChart, Bar, BarChart
} from 'recharts';

import ChartFilter from './ChartFilter';

export default function Chart({ data, onApply, selectedDate, loading }) {
  console.log("Chart received data:", data);
  console.log("Chart selected date:", selectedDate);

  const renderChart = () => {
    if (selectedDate?.mode === "day") {
      return (
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area
            type="monotone"
            dataKey="production"
            stroke="#f97316"
            fill="#fed7aa"
            fillOpacity={0.3}
            name="Production"
          />
          <Area
            type="monotone"
            dataKey="forecast"
            stroke="#22c55e"
            fill="#dcfce7"
            fillOpacity={0.3}
            name="Forecast"
          />
        </AreaChart>
      );
    } else {
      // Для режимов "month" и "year" используем столбчатую диаграмму
      return (
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="production"
            fill="#f97316"
            name="Production"
          />
          <Bar
            dataKey="forecast"
            fill="#22c55e"
            name="Forecast"
          />
        </BarChart>
      );
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow">
      <div className="flex items-center justify-between gap-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Power production</h2>
        <ChartFilter
          onApply={onApply}
          selectedDate={selectedDate}
          loading={loading}
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-[300px]">
          <div className="text-lg">Loading chart data...</div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          {renderChart()}
        </ResponsiveContainer>
      )}
    </div>
  );
}