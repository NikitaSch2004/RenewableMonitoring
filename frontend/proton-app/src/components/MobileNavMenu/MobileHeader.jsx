import { Menu, X } from 'lucide-react';
import logoUrl from '../../assets/logo.svg';

export default function MobileHeader({ isOpen, onToggle }) {
  return (
    <header className="flex items-center justify-between px-4 h-16 bg-white">
      <img src={logoUrl} alt="Logo" className="h-14" />
      <button onClick={onToggle} className="p-2">
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </header>
  );
}
