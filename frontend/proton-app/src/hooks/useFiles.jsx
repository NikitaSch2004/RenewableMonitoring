import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/api';

export const useFiles = () => {
  const { user } = useAuth();
  const [filesList, setFilesList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Определяем эндпоинты в зависимости от роли
  const getEndpoints = () => {
    const isAdmin = user?.role === 'admin';
    return {
      get: isAdmin ? '/admin/get/files/' : '/get/files/',
      create: '/add/file/',
      delete: '/delete/file/',
    };
  };

const fetchFiles = async () => {
  if (!user) return; // не загружаем без авторизации
  
  setLoading(true);
  try {
    const endpoints = getEndpoints();
    const res = await api.get(endpoints.get);

    console.log('Fetched files data:', res.data);
    
    let filesToSet = []; // Объявляем переменную здесь, чтобы она была доступна в конце
    
    // Обрабатываем структуру данных в зависимости от роли пользователя
    if (user?.role === 'admin') {
      // Для админа: разворачиваем объект с пользователями в плоский массив
      const flattenedFiles = [];
      Object.entries(res.data.data || {}).forEach(([userId, userFiles]) => {
        // Проверяем что userFiles это массив и не пустой
        if (Array.isArray(userFiles) && userFiles.length > 0) {
          userFiles.forEach(file => {
            flattenedFiles.push({
              ...file,
              user_id: userId // добавляем ID пользователя для админа
            });
          });
        }
      });
      filesToSet = flattenedFiles;
      setFilesList(flattenedFiles);
      console.log('Fetched admin files list:', flattenedFiles);
    } else {
      // Для обычного пользователя: используем старую структуру
      filesToSet = res.data.files || [];
      setFilesList(filesToSet);
      console.log('Fetched files list:', res.data.files);
    }
    
    if (filesToSet.length === 0) {
      console.log('No files found.');
    }
  } catch (err) {
    console.error('Error fetching files:', err);
  } finally {
    setLoading(false);
  }
};

  const createFile = async (newFile) => {
    try {
      const endpoints = getEndpoints();
      await api.post(endpoints.create, newFile, {
        headers: { 'Content-Type': 'application/json' },
      });
      await fetchFiles();
    } catch (err) {
      console.error('Error creating file:', err);
      throw err;
    }
  };

  const deleteFile = async (file_id) => {
    try {
      const endpoints = getEndpoints();
      await api.delete(endpoints.delete, {
        data: { file_id },
        headers: { 'Content-Type': 'application/json' },
      });
      await fetchFiles();
    } catch (err) {
      console.error('Error deleting file:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [user?.role]);

  return {
    filesList,
    loading,
    fetchFiles,
    createFile,
    deleteFile,
    isAdmin: user?.role === 'admin',
  };
};