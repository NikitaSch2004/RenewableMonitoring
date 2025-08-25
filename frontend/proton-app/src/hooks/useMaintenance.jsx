import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/api';

export const useMaintenance = () => {
  const { user } = useAuth();
  const [maintenanceList, setMaintenanceList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Определяем эндпоинты в зависимости от роли
  const getEndpoints = () => {
    const isAdmin = user?.role === 'admin';
    return {
      get: isAdmin ? '/admin/get/maintenance/' : '/get/maintenance/',
      create: '/create/maintenance/', // одинаковый для всех
      delete: '/delete/maintenance/', // одинаковый для всех
    };
  };

  const fetchMaintenance = async () => {
    if (!user) return; // не загружаем без авторизации
    
    setLoading(true);
    try {
      const endpoints = getEndpoints();
      const res = await api.get(endpoints.get);

      console.log('Fetched maintenance data:', res.data);
      
      // Обрабатываем новую структуру данных
      if (user?.role === 'admin') {
        // Для админа: разворачиваем объект с пользователями в плоский массив
        const flattenedList = [];
        Object.entries(res.data.data || {}).forEach(([userId, userMaintenances]) => {
          // Проверяем что userMaintenances это массив и не пустой
          if (Array.isArray(userMaintenances) && userMaintenances.length > 0) {
            userMaintenances.forEach(maintenance => {
              flattenedList.push({
                ...maintenance,
                user_id: userId // добавляем ID пользователя для админа
              });
            });
          }
        });
        setMaintenanceList(flattenedList);
        console.log('Fetched admin maintenance list:', flattenedList);
      } else {
        // Для обычного пользователя: используем старую структуру
        setMaintenanceList(res.data.maintenance_events || []);
        console.log('Fetched maintenance list:', res.data.maintenance_events);
      }
    } catch (err) {
      console.error('Error fetching maintenance list:', err);
    } finally {
      setLoading(false);
    }
  };

  const createMaintenance = async (newData) => {
    try {
      const endpoints = getEndpoints();
      await api.post(endpoints.create, newData, {
        headers: { 'Content-Type': 'application/json' },
      });
      await fetchMaintenance(); // обновляем список
    } catch (err) {
      console.error('Error creating maintenance:', err);
      throw err; // пробрасываем ошибку для обработки в компоненте
    }
  };

  const deleteMaintenance = async (maintenance_id) => {
    try {
      const endpoints = getEndpoints();
      await api.delete(endpoints.delete, {
        data: { maintenance_id },
        headers: { 'Content-Type': 'application/json' },
      });
      await fetchMaintenance();
    } catch (err) {
      console.error('Error deleting maintenance:', err);
      throw err;
    }
  };

  // Загружаем данные при изменении пользователя
  useEffect(() => {
    fetchMaintenance();
  }, [user?.role]); // перезагружаем если роль изменилась

  return {
    maintenanceList,
    loading,
    fetchMaintenance,
    createMaintenance,
    deleteMaintenance,
    isAdmin: user?.role === 'admin',
  };
};