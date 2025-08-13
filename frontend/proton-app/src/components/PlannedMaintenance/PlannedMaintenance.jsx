import { useState, useEffect } from "react";
import api from "../../api/api";
import PlannedMaintenanceForm from "./PlannedMaintenanceForm";
import PlannedMaintenanceList from "./PlannedMaintenanceList";
import maintenanceListUrl from "../../assets/maintenanceList.svg";

export default function PlannedMaintenance({ facilities }) {
  const [maintenanceList, setMaintenanceList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMaintenance = async () => {
    setLoading(true);
    try {
      const res = await api.get("/get/maintenance/");
      setMaintenanceList(res.data.maintenance_events || []);
      console.log("Fetched maintenance list:", res.data.maintenance_events);
    } catch (err) {
      console.error("Error fetching maintenance list:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenance();
  }, []);

  // 2. Создание записи
  const createMaintenance = async (newData) => {
    try {
      await api.post("/create/maintenance/", newData, {
        headers: { "Content-Type": "application/json" },
      });
      await fetchMaintenance(); // обновляем список
    } catch (err) {
      console.error("Error creating maintenance:", err);
    }
  };

  // 3. Удаление записи
  const deleteMaintenance = async (maintenance_id) => {
    try {
      await api.delete("/delete/maintenance/", {
        data: { maintenance_id },
        headers: { "Content-Type": "application/json" }
      });
      await fetchMaintenance();
    } catch (err) {
      console.error("Error deleting maintenance:", err);
    }
  };


  return (
    <div className="bg-white rounded-sm shadow-sm border border-gray-200 w-full">
      <div className="px-1 sm:px-4 py-2 sm:py-3 border-b border-gray-200 bg-gray-50">
        <h2 className="text-[14px] sm:text-lg font-semibold text-gray-900">Planned Maintenance</h2>
        <p className="text-gray-500 text-sm">
          Preventive maintenance to avoid unexpected failures.
        </p>
      </div>

      <div className="p-4">
        <PlannedMaintenanceForm facilities={facilities} onCreate={createMaintenance} />
      </div>

      <div className="p-4">
        <div className="max-h-[400px] overflow-y-auto border border-gray-200 rounded-lg">
          {!loading && maintenanceList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <img src={maintenanceListUrl} alt="Maintenance List" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No maintenance scheduled</h3>
              <p className="text-gray-500 text-center max-w-sm">
                Create your first planned maintenance event using the form above to keep your facilities running smoothly.
              </p>
            </div>
          ) : (
            <PlannedMaintenanceList
              maintenanceList={maintenanceList}
              loading={loading}
              onDelete={deleteMaintenance}
            />
          )}
        </div>
      </div>
    </div>
  );
}
