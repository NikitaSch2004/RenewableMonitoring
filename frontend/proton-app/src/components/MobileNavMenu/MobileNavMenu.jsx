import { useLocation } from 'react-router-dom';
import menuData from '../Sidebar/menuData';
import MobileMenuItem from './MobileMenuItem';
import MobileHeader from './MobileHeader';

export default function MobileNavMenu({ isOpen, setIsOpen }) {
  const location = useLocation();

  const handleToggle = () => setIsOpen(prev => !prev);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      {/* Всегда видимый хедер */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <MobileHeader isOpen={isOpen} onToggle={handleToggle} />
      </div>

      {/* Выпадающее меню поверх контента */}
      {isOpen && (
        <div className="fixed top-16 left-0 right-0 z-50 bg-white border-b border-t border-gray-200 shadow-lg">
          <nav className="max-h-96 overflow-y-auto">
            <div className="divide-y divide-gray-100">
              {menuData.map((section, idx) => (
                <div key={idx} className="py-3">
                  <div className="px-4 text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">
                    {section.category}
                  </div>
                  <div className="space-y-1">
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
                </div>
              ))}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}