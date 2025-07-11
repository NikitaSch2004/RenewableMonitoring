import {
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart
} from 'recharts';

import ChartFilter from './ChartFilter';

export default function Chart({data, onApply}) {
    console.log("Chart received data:", data);

  return (
    <div className="bg-white rounded-lg p-4 shadow">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Power production</h2>
        <ChartFilter onApply={onApply}/>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="active"
            stroke="#f97316"
            fill="#fed7aa"
            fillOpacity={0.3}
          />
          <Area
            type="monotone"
            dataKey="forecast"
            stroke="#22c55e"
            fill="#dcfce7"
            fillOpacity={0.3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
