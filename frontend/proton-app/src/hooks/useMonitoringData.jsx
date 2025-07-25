import { useState, useCallback } from "react";
import axios from "axios";

export const useMonitoringData = () => {
  const [facilities, setFacilities] = useState(null);
  const [productionData, setProductionData] = useState({});
  const [forecastData, setForecastData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async (date) => {
    setIsLoading(true);
    setError(null);

    try {
      const formattedDate = date.format("YYYY-MM-DD");

      // Загружаем данные параллельно
      const [facilitiesRes, facilityDataRes] = await Promise.all([
        axios.get("http://127.0.0.1:8000/api/get/facilities/"),
        axios.get(`http://127.0.0.1:8000/api/get/facility-data/?date=${formattedDate}`)
      ]);

      setFacilities(facilitiesRes.data.facilities || []);
      setForecastData(facilityDataRes.data.data || {});
      setProductionData(facilityDataRes.data.data || {});

    } catch (err) {
      console.error("Ошибка загрузки данных:", err);
      setError("Ошибка загрузки данных");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    facilities,
    productionData,
    forecastData,
    isLoading,
    error,
    loadData,
    setFacilities
  };
};