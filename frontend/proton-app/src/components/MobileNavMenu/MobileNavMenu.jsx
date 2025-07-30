import { useLocation } from 'react-router-dom';
import menuData from '../Sidebar/menuData';
import MobileMenuItem from './MobileMenuItem';
import MobileHeader from './MobileHeader';

export default function MobileNavMenu({ isOpen, setIsOpen }) {
  const location = useLocation();

  const handleToggle = () => setIsOpen(prev => !prev);
  const handleClose = () => setIsOpen(false);

  return (
    <div className="absolute top-0 left-0 right-0 z-10 bg-white shadow-lg flex flex-col min-w-80">
      <div className="shadow">
        <MobileHeader isOpen={isOpen} onToggle={handleToggle} />
      </div>

      {isOpen && <nav className="divide-y divide-gray-200">
        {menuData.map((section, idx) => (
          <div key={idx} className="py-2">
            <div className="px-4 text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">
              {section.category}
            </div>
            {section.items.map((item, i) => (
              <MobileMenuItem
                key={i}
                icon={item.icon}
                text={item.text}
                to={item.to}
                disabled={item.disabled}
                isActive={location.pathname === item.to}
                onClick={handleClose}
              />
            ))}
          </div>
        ))}
      </nav>}
    </div>
  );
}
