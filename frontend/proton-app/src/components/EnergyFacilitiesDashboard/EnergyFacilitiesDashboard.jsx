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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 w-full">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Best salesman</h2>
      </div>

      <div className="overflow-hidden">
        <table className="w-full">
          <thead className="bg-white border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-lg text-gray-500 font-medium">Energy facility</th>
              <th className="px-4 py-3 text-center text-lg text-gray-500 font-medium">Status</th>
              <th className="px-4 py-3 text-center text-lg text-gray-500 font-medium">Active power</th>
              <th className="px-4 py-3 text-center text-lg text-gray-500 font-medium">Schedule</th>
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
