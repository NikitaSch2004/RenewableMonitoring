import { useMaintenance } from "../../hooks/useMaintenance";
import PlannedMaintenanceForm from "./PlannedMaintenanceForm";
import PlannedMaintenanceList from "./PlannedMaintenanceList";
import maintenanceListUrl from "../../assets/maintenanceList.svg";
import { useTranslation } from "../../hooks/useTranslation";

export default function PlannedMaintenance({ facilities }) {
  const { maintenanceList, loading, createMaintenance, deleteMaintenance, isAdmin } = useMaintenance();
  const t = useTranslation("plannedMaintenance"); // namespace

  return (
    <div className="bg-white rounded-sm shadow-sm border border-gray-200 w-full">
      <div className="px-1 sm:px-4 py-2 sm:py-3 border-b border-gray-200 bg-gray-50">
        <h2 className="text-[14px] sm:text-lg font-semibold text-gray-900">
          {isAdmin ? t("titleAdmin") : t("title")}
        </h2>
        <p className="text-gray-500 text-sm">
          {isAdmin ? t("descAdmin") : t("desc")}
        </p>
      </div>

      {!isAdmin && (
        <div className="p-4">
          <PlannedMaintenanceForm facilities={facilities} onCreate={createMaintenance} />
        </div>
      )}

      <div className="p-4">
        <div className="max-h-[400px] overflow-y-auto border border-gray-200 rounded-lg">
          {!loading && maintenanceList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <img src={maintenanceListUrl} alt="Maintenance List" />
              </div>
              <h3 className="text-lg text-center font-medium text-gray-900 mb-2">
                {isAdmin ? t("emptyTitleAdmin") : t("emptyTitle")}
              </h3>
              <p className="text-gray-500 text-center max-w-sm">
                {isAdmin ? t("emptyDescAdmin") : t("emptyDesc")}
              </p>
            </div>
          ) : (
            <PlannedMaintenanceList
              maintenanceList={maintenanceList}
              loading={loading}
              onDelete={deleteMaintenance}
              isAdmin={isAdmin}
            />
          )}
        </div>
      </div>
    </div>
  );
}
