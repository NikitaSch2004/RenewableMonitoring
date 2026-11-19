import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/api';
import dayjs from 'dayjs';

export const useMonitoringData = () => {
  const { user, logout } = useAuth();
  const [facilities, setFacilities] = useState([]);
  const [productionData, setProductionData] = useState({});
  const [forecastData, setForecastData] = useState({});
  const [selectedDate, setSelectedDate] = useState({ mode: null, date: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Определяем эндпоинты в зависимости от роли
  const getEndpoints = () => {
    const isAdmin = user?.role === 'admin';
    return {
      facilities: isAdmin ? '/admin/get/facilities/' : '/get/facilities/',
      facilityData: '/get/facility-data/', // Этот эндпоинт одинаковый для всех
    };
  };

  const loadData = async (mode, date) => {
    if (!user) return; // не загружаем без авторизации

    setLoading(true);
    setError(null);

    try {
      const formattedDate = date.format("YYYY-MM-DD");
      const endpoints = getEndpoints();

      const [facilitiesRes, facilityDataRes] = await Promise.all([
        api.get(endpoints.facilities),
        api.get(`${endpoints.facilityData}?date=${formattedDate}&mode=${mode}`),
      ]);

      console.log('Fetched facilities data:', facilitiesRes.data);

      let facilitiesToSet = []; // Объявляем переменную здесь

      // Обрабатываем структуру данных в зависимости от роли пользователя
      if (user?.role === 'admin') {
        // Для админа: разворачиваем объект с пользователями в плоский массив
        const flattenedFacilities = [];
        Object.entries(facilitiesRes.data.data || {}).forEach(([userId, userFacilities]) => {
          // Проверяем что userFacilities это массив и не пустой
          if (Array.isArray(userFacilities) && userFacilities.length > 0) {
            userFacilities.forEach(facility => {
              flattenedFacilities.push({
                ...facility,
                user_id: userId // добавляем ID пользователя для админа
              });
            });
          }
        });
        facilitiesToSet = flattenedFacilities;
        console.log('Fetched admin facilities list:', flattenedFacilities);
      } else {
        // Для обычного пользователя: используем старую структуру
        facilitiesToSet = facilitiesRes.data.facilities || [];
        console.log('Fetched facilities list:', facilitiesRes.data.facilities);
      }

      // Обрабатываем данные facilities, добавляем поле active для тогла. Оно сохраняет состояние.
      setFacilities(prevFacilities => {
        return facilitiesToSet.map(newFacility => {
          const prevFacility = prevFacilities.find(f => f.id === newFacility.id);

          return {
            ...newFacility,
            active: newFacility.status === "success"
              ? prevFacility?.active ?? true
              : false
          };
        });
      });

      setForecastData(facilityDataRes.data.forecast_data || {});
      setProductionData(facilityDataRes.data.production_data || {});
      console.log("Production data loaded successfully");

    } catch (err) {
      console.error("Error loading data:", err);

      // Проверка на 401
      if (err.response?.status === 401) {
        logout(); // вызов logout при 401
      } else {
        setError("Failed to load data from server");
      }
    } finally {
      setLoading(false);
    }
  };

  // Загрузка данных при первом рендеринге (на сегодняшний день)
  useEffect(() => {
    if (user) {
      const date = dayjs("2025-07-19"); // Сегодня. UPD: 19 июля 2025 года
      const mode = "day";
      setSelectedDate({ mode, date });
      loadData(mode, date);
    }
  }, [user?.role]);

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

  // Утилита для округления чисел
  const roundFloat = (num, decimals = 6) => {
    return Math.round((num + Number.EPSILON) * Math.pow(10, decimals)) / Math.pow(10, decimals);
  };

  // Считаем данные для чарта
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

  return {
    facilities,
    productionData,
    forecastData,
    selectedDate,
    loading,
    error,
    chartData,
    handleToggleActive,
    handleLoadData,
    isAdmin: user?.role === 'admin',
  };
};