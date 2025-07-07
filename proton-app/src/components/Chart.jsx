import {
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart
} from 'recharts';

import {
  Calendar
} from 'lucide-react';

const powerData = [
  { time: '00:00', active: 45, forecast: 50 },
  { time: '04:00', active: 55, forecast: 60 },
  { time: '08:00', active: 65, forecast: 75 },
  { time: '12:00', active: 70, forecast: 80 },
  { time: '16:00', active: 60, forecast: 70 },
  { time: '20:00', active: 35, forecast: 40 },
  { time: '24:00', active: 25, forecast: 30 }
];

export default function Chart() {
  return (
    <div className="bg-white rounded-lg p-4 shadow">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Power production</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Start Date"
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="End Date"
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={powerData}>
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
