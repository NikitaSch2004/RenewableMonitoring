import { useState } from "react";

export default function TurbineList() {
  const [facilities, setFacilities] = useState([
    { name: "Wind turbine 1", status: "success", statusText: "OK", power: "1500 kW", active: true },
    { name: "Wind turbine 2", status: "error", statusText: "Error", power: "1500 kW", active: false },
    { name: "Wind turbine 3", status: "success", statusText: "OK", power: "1500 kW", active: true },
    { name: "Solar panels", status: "success", statusText: "OK", power: "1500 kW", active: true },
  ]);

  const toggleActive = (index) => {
    setFacilities((prev) =>
      prev.map((facility, i) =>
        i === index ? { ...facility, active: !facility.active } : facility
      )
    );
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Energy Facilities</h3>

      <div className="rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase">Facility</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase">Power</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase">Active</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {facilities.map((facility, index) => {
              const isDisabled = facility.status !== "success";

              return (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span
                        className={`w-2 h-2 rounded-full mr-3 ${
                          facility.status === "success" ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                      <div>
                        <div className="font-medium text-gray-900">{facility.name}</div>
                        <div className="text-gray-500">{facility.statusText}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        facility.status === "success"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {facility.statusText}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-gray-900">{facility.power}</td>

                  <td className="px-6 py-4">
                    <button
                      onClick={() => {
                        if (!isDisabled) toggleActive(index);
                      }}
                      disabled={isDisabled}
                      className={`w-10 h-6 rounded-full p-1 transition-colors ${
                        isDisabled
                          ? "bg-gray-200 cursor-not-allowed"
                          : facility.active
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          facility.active ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
