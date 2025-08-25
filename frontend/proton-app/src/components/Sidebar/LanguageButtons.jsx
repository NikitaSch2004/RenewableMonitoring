import { useLanguage } from "../../contexts/LanguageContext";

export default function LanguageButtons() {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: "ru", label: "RU" },
    { code: "en", label: "EN" },
    { code: "ro", label: "RO" },
  ];

  return (
    <div className="flex justify-around items-center px-2 py-3 border-b border-gray-200">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={`px-3 py-1 text-sm font-medium transition ${
            language === lang.code
              ? "bg-yellow-500 text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
