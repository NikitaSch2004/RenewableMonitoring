import { useState, useMemo, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
import Chart from "../components/Chart/Chart";
import EnergyFacilitiesDashboard from "../components/EnergyFacilitiesDashboard/EnergyFacilitiesDashboard";

export default function Monitoring() {
  const [facilities, setFacilities] = useState([]);
  const [productionData, setProductionData] = useState({});
  const [forecastData, setForecastData] = useState({});
  const [selectedDate, setSelectedDate] = useState({ mode: null, date: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const loadData = async (mode, date) => {
    setLoading(true);
    setError(null);
    
    try {
      const formattedDate = date.format("YYYY-MM-DD");
      const [facilitiesRes, facilityDataRes] = await Promise.all([
        axios.get("http://127.0.0.1:8000/api/get/facilities/"),
        axios.get(`http://127.0.0.1:8000/api/get/facility-data/?date=${formattedDate}&mode=${mode}`)
      ]);
      
      // Обрабатываем данные facilities, добавляем поле active для тоглла
      const facilitiesWithActive = (facilitiesRes.data.facilities || []).map(facility => ({
        ...facility,
        active: facility.status === "success"
      }));
      
      setFacilities(facilitiesWithActive);
      setForecastData(facilityDataRes.data.forecast_data || {});
      setProductionData(facilityDataRes.data.production_data || {});
      console.log("Production data: "+facilitiesRes.forecast_data);
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Failed to load data from server");
    } finally {
      setLoading(false);
    }
  };

  // Загрузка данных при первом рендеринге (на сегодняшний день)
  useEffect(() => {
    const date = dayjs(); //СЕгодня
    const mode = "day"
    setSelectedDate({mode, date});
    loadData(mode, date);
  }, []);

  const handleToggleActive = (id) => {
    setFacilities((prev) =>
      prev.map((f) => (f.id === id ? { ...f, active: !f.active } : f))
    );
  };

  const handleLoadData = async ({ mode, date }) => {
    console.log("Loading data for:", { mode, date: date.format() });
    
    // Сначала обновляем состояние даты
    setSelectedDate({ mode, date });
    
    // Затем загружаем данные
    try {
      await loadData(mode, date);
      console.log("Data loaded successfully for:", date.format());
    } catch (err) {
      console.error("Failed to load data:", err);
    }
  };

  // Считаем данные для чарта
const roundFloat = (num, decimals = 6) => {
  return Math.round((num + Number.EPSILON) * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

const chartData = useMemo(() => {
  if (!productionData || Object.keys(productionData).length === 0) {
    return [];
  }

  return Object.entries(productionData).map(([time, productionMap]) => {
    
    const productionSum = Object.entries(productionMap)
      .filter(([id]) => {
        const fac = facilities.find((f) => f.id === Number(id));
        return fac?.active;
      })
      .reduce((sum, [, v]) => sum + v, 0);
    
    const forecastSum = Object.entries(forecastData[time] || {})
      .filter(([id]) => {
        const fac = facilities.find((f) => f.id === Number(id));
        return fac?.active;
      })
      .reduce((sum, [, v]) => sum + v, 0);

    return { 
      time, 
      production: roundFloat(productionSum),
      forecast: roundFloat(forecastSum)
    };
  });
}, [facilities, productionData, forecastData]);

if (loading && chartData.length === 0) {
  return (
    <div className="p-10 space-y-8">
      <div className="h-64 bg-gray-200 animate-pulse rounded-lg"></div>
      <div className="h-32 bg-gray-200 animate-pulse rounded-lg"></div>
      <div className="h-64 bg-gray-200 animate-pulse rounded-lg"></div>
    </div>
  );
}

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-8 p-10">
      <Chart 
        data={chartData} 
        onApply={handleLoadData}
        selectedDate={selectedDate}
        loading={loading}
      />
      <EnergyFacilitiesDashboard
        facilities={facilities}
        onToggle={handleToggleActive}
      />
    </div>
  );
}