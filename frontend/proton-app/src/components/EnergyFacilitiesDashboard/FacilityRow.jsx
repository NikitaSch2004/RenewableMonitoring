import StatusBadge from "./StatusBadge.jsx";
import ToggleSwitch from "./ToggleSwitch.jsx";

export default function FacilityRow({ facility, onToggle }) {
  const isDisabled = facility.status !== "success";

  return (
    <tr className={`hover:bg-gray-50 ${!facility.active ? 'opacity-50' : ''}`}>
      <td className="px-2 sm:px-4 py-1 sm:py-3">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-10 sm:w-16 flex-shrink-0">
            <StatusBadge status={facility.status} />
          </div>
          <span className="text-[11px] sm:text-base text-gray-900 font-medium">{facility.name}</span>
        </div>
      </td>

      <td className="px-2 sm:px-4 py-1 sm:py-3 text-center">
        <span
          className={`text-xs sm:text-sm font-semibold ${
            facility.status === "success" ? "text-green-800" : "text-red-800"
          }`}
        >
          {facility.status === "success" ? "OK" : "Error"}
        </span>
      </td>

      <td className="px-2 sm:px-4 py-1 sm:py-3 text-center text-[11px] sm:text-base text-gray-900 font-medium">
        {facility.power}
      </td>

      <td className="px-2 sm:px-4 py-1 sm:py-3 text-center">
        <ToggleSwitch
          active={facility.active}
          disabled={isDisabled}
          onToggle={() => !isDisabled && onToggle(facility.id)}
        />
      </td>
    </tr>
  );
}
