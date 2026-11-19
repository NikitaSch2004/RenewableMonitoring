import { Menu, X } from 'lucide-react';
import logoUrl from '../../assets/logo.svg';
import LanguageSwitcher from './LanguageSwitcher';

export default function MobileHeader({ isOpen, onToggle }) {
  return (
    <header className="flex items-center justify-between px-4 h-16 bg-white">
      {/* Логотип */}
      <img src={logoUrl} alt="Logo" className="h-14" />

      {/* Панель справа */}
      <div className="flex items-center gap-3">
        <LanguageSwitcher />
        <button onClick={onToggle} className="p-2">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  );
}
