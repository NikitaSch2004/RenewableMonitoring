import { useState, useMemo } from "react";
import Chart from "../components/Chart/Chart";
import ChartFilters from "../components/Chart/ChartFilter";
import EnergyFacilitiesDashboard from "../components/EnergyFacilitiesDashboard/EnergyFacilitiesDashboard";

const activeData = {
  "2025-07-08T00:00": { "1": 50, "2": 60, "3": 45, "4": 30 },
  "2025-07-08T01:00": { "1": 55, "2": 65, "3": 50, "4": 35 },
  "2025-07-08T02:00": { "1": 45, "2": 55, "3": 40, "4": 25 },
  "2025-07-08T03:00": { "1": 60, "2": 70, "3": 55, "4": 40 },
  "2025-07-08T04:00": { "1": 65, "2": 75, "3": 60, "4": 45 },
  "2025-07-08T05:00": { "1": 70, "2": 80, "3": 65, "4": 50 },
  "2025-07-08T06:00": { "1": 75, "2": 85, "3": 70, "4": 55 },
  "2025-07-08T07:00": { "1": 80, "2": 90, "3": 75, "4": 60 },
  "2025-07-08T08:00": { "1": 85, "2": 95, "3": 80, "4": 65 },
  "2025-07-08T09:00": { "1": 90, "2": 100, "3": 85, "4": 70 },
  "2025-07-08T10:00": { "1": 95, "2": 105, "3": 90, "4": 75 },
  "2025-07-08T11:00": { "1": 100, "2": 110, "3": 95, "4": 80 },
  "2025-07-08T12:00": { "1": 105, "2": 115, "3": 100, "4": 85 },
  "2025-07-08T13:00": { "1": 100, "2": 110, "3": 95, "4": 80 },
  "2025-07-08T14:00": { "1": 95, "2": 105, "3": 90, "4": 75 },
  "2025-07-08T15:00": { "1": 90, "2": 100, "3": 85, "4": 70 },
  "2025-07-08T16:00": { "1": 85, "2": 95, "3": 80, "4": 65 },
  "2025-07-08T17:00": { "1": 80, "2": 90, "3": 75, "4": 60 },
  "2025-07-08T18:00": { "1": 75, "2": 85, "3": 70, "4": 55 },
  "2025-07-08T19:00": { "1": 70, "2": 80, "3": 65, "4": 50 },
  "2025-07-08T20:00": { "1": 65, "2": 75, "3": 60, "4": 45 },
  "2025-07-08T21:00": { "1": 60, "2": 70, "3": 55, "4": 40 },
  "2025-07-08T22:00": { "1": 55, "2": 65, "3": 50, "4": 35 },
  "2025-07-08T23:00": { "1": 50, "2": 60, "3": 45, "4": 30 }
};

const forecastData = {
  "2025-07-08T00:00": { "1": 55, "2": 65, "3": 50, "4": 35 },
  "2025-07-08T01:00": { "1": 60, "2": 70, "3": 55, "4": 40 },
  "2025-07-08T02:00": { "1": 50, "2": 60, "3": 45, "4": 30 },
  "2025-07-08T03:00": { "1": 65, "2": 75, "3": 60, "4": 45 },
  "2025-07-08T04:00": { "1": 70, "2": 80, "3": 65, "4": 50 },
  "2025-07-08T05:00": { "1": 75, "2": 85, "3": 70, "4": 55 },
  "2025-07-08T06:00": { "1": 80, "2": 90, "3": 75, "4": 60 },
  "2025-07-08T07:00": { "1": 85, "2": 95, "3": 80, "4": 65 },
  "2025-07-08T08:00": { "1": 90, "2": 100, "3": 85, "4": 70 },
  "2025-07-08T09:00": { "1": 95, "2": 105, "3": 90, "4": 75 },
  "2025-07-08T10:00": { "1": 100, "2": 110, "3": 95, "4": 80 },
  "2025-07-08T11:00": { "1": 105, "2": 115, "3": 100, "4": 85 },
  "2025-07-08T12:00": { "1": 110, "2": 120, "3": 105, "4": 90 },
  "2025-07-08T13:00": { "1": 105, "2": 115, "3": 100, "4": 85 },
  "2025-07-08T14:00": { "1": 100, "2": 110, "3": 95, "4": 80 },
  "2025-07-08T15:00": { "1": 95, "2": 105, "3": 90, "4": 75 },
  "2025-07-08T16:00": { "1": 90, "2": 100, "3": 85, "4": 70 },
  "2025-07-08T17:00": { "1": 85, "2": 95, "3": 80, "4": 65 },
  "2025-07-08T18:00": { "1": 80, "2": 90, "3": 75, "4": 60 },
  "2025-07-08T19:00": { "1": 75, "2": 85, "3": 70, "4": 55 },
  "2025-07-08T20:00": { "1": 70, "2": 80, "3": 65, "4": 50 },
  "2025-07-08T21:00": { "1": 65, "2": 75, "3": 60, "4": 45 },
  "2025-07-08T22:00": { "1": 60, "2": 70, "3": 55, "4": 40 },
  "2025-07-08T23:00": { "1": 55, "2": 65, "3": 50, "4": 35 }
};

const facilitiesData = [
  { id: 1, name: "Wind facility 1", status: "success", power: "2500 kW", active: true },
  { id: 2, name: "Wind facility 2", status: "error", power: "1500 kW", active: false },
  { id: 3, name: "Wind facility 3", status: "success", power: "1500 kW", active: true },
  { id: 4, name: "Solar panels", status: "success", power: "3500 kW", active: true },
];

export default function Monitoring() {
  const [facilities, setFacilities] = useState(facilitiesData);
  const [dateRange, setDateRange] = useState({ start: null, end: null, });

  const handleToggleActive = (id) => {
    setFacilities((prev) =>
      prev.map((f) => (f.id === id ? { ...f, active: !f.active } : f))
    );
  };

  const handleLoadData = ({ start, end }) => {
    setDateRange({ start, end });
    console.log("Former data", dateRange);
  }

  // Считаем данные
  const chartData = useMemo(() => {
    return Object.entries(activeData).map(([timestamp, activeMap]) => {
      const time = timestamp.slice(11); // «HH:MM»
      const activeSum = Object.entries(activeMap)
        .filter(([id]) => {
          const fac = facilities.find((f) => f.id === Number(id));
          return fac?.active;
        })
        .reduce((sum, [, v]) => sum + v, 0);
      const forecastSum = Object.entries(forecastData[timestamp])
        .filter(([id]) => {
          const fac = facilities.find((f) => f.id === Number(id));
          return fac?.active;
        })
        .reduce((sum, [, v]) => sum + v, 0);

      return { time, active: activeSum, forecast: forecastSum };
    });
  }, [facilities]);


  return (
    <div className="flex flex-col space-y-8 p-10">
      <Chart data={chartData} onApply={handleLoadData} />
      <EnergyFacilitiesDashboard
        facilities={facilities}
        onToggle={handleToggleActive}
      />
    </div>
  );
}
