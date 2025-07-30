import { useState } from "react";
import FacilityRow from "./FacilityRow.jsx";

export default function EnergyFacilitiesDashboard({facilities, onToggle}) {
/*   const [facilities, setFacilities] = useState([
    { id: 1, name: "Wind facility 1", status: "success", power: "1500 kW", active: true },
    { id: 2, name: "Wind facility 2", status: "error", power: "1500 kW", active: false },
    { id: 3, name: "Wind facility 3", status: "success", power: "1500 kW", active: true },
    { id: 4, name: "Solar panels", status: "success", power: "1500 kW", active: true },
  ]);

  const handleToggleActive = (id) => {
    setFacilities((prev) =>
      prev.map((facility) =>
        facility.id === id ? { ...facility, active: !facility.active } : facility
      )
    );
  }; */

return (
  <div className="bg-white rounded-sm shadow-sm border border-gray-200 w-full">
    <div className="bg-gray-50  px-1 sm:px-4 py-2 sm:py-3 border-b border-gray-200">
      <h2 className="text-[14px] sm:text-lg font-semibold text-gray-900">Best salesman</h2>
    </div>

    {/* Responsive table wrapper */}
    <div className="overflow-x-auto">
      <table className="min-w-full table-fixed">
        <thead className="bg-white border-b border-gray-200">
          <tr>
            <th className="px-1 sm:px-4 py-1 sm:py-3 text-left text-[12px] sm:text-base text-gray-500 font-medium whitespace-nowrap">Energy facility</th>
            <th className="px-1 sm:px-4 py-1 sm:py-3 text-center text-[12px] sm:text-base text-gray-500 font-medium whitespace-nowrap">Status</th>
            <th className="px-1 sm:px-4 py-1 sm:py-3 text-center text-[12px] sm:text-base text-gray-500 font-medium whitespace-nowrap">Active power</th>
            <th className="px-1 sm:px-4 py-1 sm:py-3 text-center text-[12px] sm:text-base text-gray-500 font-medium whitespace-nowrap">Schedule</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {facilities.map((facility) => (
            <FacilityRow key={facility.id} facility={facility} onToggle={onToggle} />
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
}
