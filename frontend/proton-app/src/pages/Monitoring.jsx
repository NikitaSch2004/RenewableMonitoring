import Chart from "../components/Chart/Chart";
import EnergyFacilitiesDashboard from "../components/EnergyFacilitiesDashboard/EnergyFacilitiesDashboard";
import PlannedMaintenance from "../components/PlannedMaintenance/PlannedMaintenance";
import FilesDashboard from "../components/FilesDashboard/FilesDashboard";
import RenewableMapLeaflet from "../components/RenewableMapLeaflet.jsx";
import { useMonitoringData } from "../hooks/useMonitoringData";

export default function Monitoring() {
  const {
    facilities,
    selectedDate,
    loading,
    error,
    chartData,
    handleToggleActive,
    handleLoadData,
  } = useMonitoringData();

  if (loading && chartData.length === 0) {
    return (
      <div className="pl-4 pr-4 pt-24 pb-24 lg:p-10 space-y-8">
        <div className="h-96 bg-gray-200 animate-pulse rounded-lg"></div>
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
    <div className="flex flex-col space-y-8 pl-4 pr-4 pt-24 pb-24 lg:p-10">
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

      <PlannedMaintenance facilities={facilities} />

      <FilesDashboard />

      <RenewableMapLeaflet facilities={facilities} />
    </div>
  );
}