import PlannedMaintenanceForm from "./PlannedMaintenanceForm";
import PlannedMaintenanceList from "./PlannedMaintenanceList";

export default function PlannedMaintenance({facilities}) {
  return (
    <div className="bg-white rounded-sm shadow-sm border border-gray-200 w-full">
      <div className="px-1 sm:px-4 py-2 sm:py-3 border-b border-gray-200 bg-gray-50">
        <h2 className="text-[14px] sm:text-lg font-semibold text-gray-900">Planned Maintenance</h2>
        <p className="text-gray-500 text-sm">Preventive maintenance to avoid unexpected failures.</p>
      </div>
      <div className="p-4">
        <PlannedMaintenanceForm  facilities={facilities}/>
      </div>
      
      <div className = "p-4">
        <div className = "max-h-[400px] overflow-y-auto border border-gray-200 rounded-lg">
         <PlannedMaintenanceList/>
        </div>
      </div>
    </div>
  );
}
