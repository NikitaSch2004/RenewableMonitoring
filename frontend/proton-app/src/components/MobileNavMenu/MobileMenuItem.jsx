import { Link } from 'react-router-dom';

export default function MobileMenuItem({ icon: Icon, text, to, isActive, disabled, onClick }) {
  const baseClasses = 'flex items-center space-x-3 px-4 py-3 text-lg transition-colors';
  
  const linkClasses = disabled
    ? `${baseClasses} text-gray-400 cursor-not-allowed opacity-50`
    : `${baseClasses} hover:bg-gray-50 ${
        isActive ? 'bg-gray-100 text-yellow-600 font-medium' : 'text-gray-800'
      }`;

  const Content = (
    <div className={linkClasses}>
      {Icon && <Icon size={20} className={disabled ? 'text-gray-300' : isActive ? 'text-yellow-600' : 'text-gray-500'} />}
      <span>{text}</span>
    </div>
  );

  if (disabled) {
    return <div>{Content}</div>;
  }

  return (
    <Link to={to} onClick={onClick}>
      {Content}
    </Link>
  );
}
