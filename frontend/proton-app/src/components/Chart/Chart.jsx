import {
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Area, AreaChart, Bar, BarChart
} from 'recharts';

import ChartFilter from './ChartFilter';

import {useTranslation} from '../../hooks/useTranslation';

export default function Chart({ data, onApply, selectedDate, loading }) {
  console.log("Chart received data:", data);
  console.log("Chart selected date:", selectedDate);
  const t = useTranslation("chart"); // namespace

const renderChart = () => {
  if (selectedDate?.mode === "day") {
    return (
      <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="time" 
          fontSize={12}
        />
        <YAxis 
          fontSize={12}
          width={40}
        />
        <Tooltip />
        <Legend />
        <Area
          type="monotone"
          dataKey="production"
          stroke="#f97316"
          fill="#fed7aa"
          fillOpacity={0.3}
          name={t("production")}
        />
        <Area
          type="monotone"
          dataKey="forecast"
          stroke="#22c55e"
          fill="#dcfce7"
          fillOpacity={0.3}
          name={t("forecast")}
        />
      </AreaChart>
    );
  } else {
    return (
      <BarChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="time" 
          fontSize={12}
        />
        <YAxis 
          fontSize={12}
          width={40}
        />
        <Tooltip />
        <Legend />
        <Bar
          dataKey="production"
          fill="#f97316"
          name={t("production")}
        />
        <Bar
          dataKey="forecast"
          fill="#22c55e"
          name={t("forecast")}
        />
      </BarChart>
    );
  }
};

  return (
      <div className="bg-white rounded-lg p-3 lg:p-10 shadow">
        <div className="flex flex-col lg:flex-row items-center lg:justify-between gap-4 lg:gap-6 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{t("title")}</h2>
          <ChartFilter
            onApply={onApply}
            selectedDate={selectedDate}
            loading={loading}
          />
        </div>

    {loading ? (
      <div className="flex justify-center items-center h-[250px] lg:h-[300px]">
        <div className="text-lg">{t("loading")}</div>
      </div>
    ) : (
      <ResponsiveContainer width="100%" height={300} className={"overflow-hidden"}>
        {renderChart()}
      </ResponsiveContainer>
    )}
      </div>
  );
}