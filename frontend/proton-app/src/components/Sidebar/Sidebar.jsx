import { useLocation } from 'react-router-dom';
import MenuItem from './MenuItem';
import CategoryHeader from './CategoryHeader';
import Notification from './Notification';
import Arrow from './Arrow';
import menuData from './menuData';
import logoUrl from '../../assets/logo.svg';

export default function Sidebar() {
    const location = useLocation();

    const renderRightElement = (item) => {
        switch (item.rightElement) {
            case 'arrow':
                return <Arrow />;
            case 'notification':
                return <Notification count={item.count} />;
            default:
                return null;
        }
    };

    return (
        <div className="w-60 h-full bg-white border-r border-gray-200 flex flex-col">
            {/* Logo Header */}
            <div className="shadow-sm">
                <img src={logoUrl} alt="Proton Energy Solutions"/>
            </div>

            {/* Scrollable Navigation */}
            <nav className="flex-1 overflow-y-auto">
                {menuData.map((section, index) => (
                    <div key={index} className="mb-1">
                        <CategoryHeader title={section.category} />
                        <div className="space-y-1">
                            {section.items.map((item, idx) => (
                                <MenuItem
                                    key={idx}
                                    icon={item.icon}
                                    text={item.text}
                                    to={item.to}
                                    rightElement={renderRightElement(item)}
                                    isActive={location.pathname === item.to}
                                    disabled={item.disabled}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </nav>
        </div>
    );
}