export default function ToggleSwitch({ active, disabled, onToggle }) {
  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      className={`relative w-8 h-4 sm:w-11 sm:h-6 rounded-full transition-colors ${
        disabled
          ? "bg-gray-200 cursor-not-allowed"
          : active
          ? "bg-green-500"
          : "bg-gray-300"
      }`}
    >
      <div
        className={`absolute top-0.5 left-0.5 w-3 h-3 sm:w-5 sm:h-5 rounded-full bg-white transition-transform ${
          active ? "sm:translate-x-5 translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  );
}