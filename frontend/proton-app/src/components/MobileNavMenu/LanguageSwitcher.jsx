// components/LanguageSwitcher.jsx
import { useLanguage } from '../../contexts/LanguageContext';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const buttonStyle = (lang) =>
    `px-2 py-1 text-xs font-medium transition ${
      language === lang
        ? 'bg-yellow-500 text-white'
        : 'bg-gray-100 hover:bg-gray-200'
    }`;

  return (
    <div className="flex items-center gap-1">
      <button onClick={() => setLanguage('ru')} className={buttonStyle('ru')}>
        RU
      </button>
      <button onClick={() => setLanguage('en')} className={buttonStyle('en')}>
        EN
      </button>
      <button onClick={() => setLanguage('ro')} className={buttonStyle('ro')}>
        RO
      </button>
    </div>
  );
}
