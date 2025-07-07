import { Link } from 'react-router-dom';

export default function MenuItem({ icon: Icon, text, to, rightElement, isActive }) {
    return (
        <Link
            to={to}
            className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors hover:bg-gray-50 ${isActive ? 'bg-gray-50 text-yellow-500' : ''
                } ${isActive && !rightElement ? 'border-r-2 border-yellow-500' : ''}`}
        >
            <div className="flex items-center space-x-3">
                <Icon
                    size={20}
                    className={`${isActive ? 'text-yellow-500' : 'text-gray-500'}`}
                />
                <span className={`text-sm ${isActive ? 'text-yellow-500 font-medium' : 'text-gray-700'}`}>
                    {text}
                </span>
            </div>
            {rightElement}
        </Link>
    );
}
