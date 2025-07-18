export default function Button({ children, onClick, variant = "default", disabled = false, className = "" }) {
    const baseStyles = "px-4 py-2 rounded-lg font-medium transition-colors";
    const variants = {
        default: "bg-blue-600 text-white hover:bg-blue-700",
        outline: "border border-gray-400 text-gray-700 hover:bg-gray-100",
        yellow: "bg-yellow-400 hover:bg-yellow-500 text-white font-bold text-lg",
    };
    const disabledStyles = "opacity-50 cursor-not-allowed";

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
        ${baseStyles} 
        ${variants[variant]} 
        ${disabled ? disabledStyles : ""} 
        ${className}
      `}
        >
            {children}
        </button>
    );
}
