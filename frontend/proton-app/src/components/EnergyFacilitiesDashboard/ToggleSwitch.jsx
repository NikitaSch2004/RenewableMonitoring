export default function ToggleSwitch({ active, disabled, onToggle }) {
  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      className={`relative w-11 h-6 rounded-full transition-colors ${
        disabled
          ? "bg-gray-200 cursor-not-allowed"
          : active
          ? "bg-green-500"
          : "bg-gray-300"
      }`}
    >
      <div
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
          active ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}
