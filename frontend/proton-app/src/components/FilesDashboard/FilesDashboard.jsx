import { useState, useEffect } from "react";
import api from "../../api/api";
import FilesList from "./FilesList";
import filesListUrl from "../../assets/filesList.svg"; // Assuming this is the correct path

export default function FilesDashboard() {
  const [filesList, setFilesList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFilesList = async () => {
    setLoading(true);
    try {
      const res = await api.get("/get/files/");
      setFilesList(res.data.files || []);
      console.log("Fetched Files list:", res.data.files);
    } catch (err) {
      console.error("Error fetching files list:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilesList();
  }, []);

/*   // 2. Создание записи
  const addFile = async (newFile) => {
    try {
      await api.post("/add/file/", newFile, {
        headers: { "Content-Type": "application/json" },
      });
      await fetchFilesList(); // обновляем список
    } catch (err) {
      console.error("Error creating file:", err);
    }
  }; */

/*   // 3. Удаление записи
  const deletefile = async (file_id) => {
    try {
      await api.delete("/delete/file/", {
        data: { file_id },
        headers: { "Content-Type": "application/json" }
      });
      await fetchfile();
    } catch (err) {
      console.error("Error deleting file:", err);
    }
  }; */

  return (
    <div className="bg-white rounded-sm shadow-sm border border-gray-200 w-full">
      <div className="px-1 sm:px-4 py-2 sm:py-3 border-b border-gray-200 bg-gray-50">
        <h2 className="text-[14px] sm:text-lg font-semibold text-gray-900">Files</h2>
        <p className="text-gray-500 text-sm">Here you can see list of your files</p>
      </div>

<div className="p-4">
        <div className="max-h-[400px] overflow-y-auto border border-gray-200 rounded-lg">
          {!loading && filesList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <img src={filesListUrl} alt="Files List" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No files</h3>
              <p className="text-gray-500 text-center max-w-sm">
                There are no files uploaded yet.
              </p>
            </div>
          ) : (
            <FilesList
              filesList={filesList}
              loading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
}