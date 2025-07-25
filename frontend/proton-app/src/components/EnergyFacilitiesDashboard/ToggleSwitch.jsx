export default function ToggleSwitch({ active, disabled, onToggle }) {
  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      className={`relative w-8 h-4 lg:w-11 lg:h-6 rounded-full transition-colors ${
        disabled
          ? "bg-gray-200 cursor-not-allowed"
          : active
          ? "bg-green-500"
          : "bg-gray-300"
      }`}
    >
      <div
        className={`absolute top-0.5 left-0.5 w-3 h-3 lg:w-5 lg:h-5 rounded-full bg-white transition-transform ${
          active ? "lg:translate-x-5 translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  );
}