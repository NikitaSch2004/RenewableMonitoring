import { Link } from 'react-router-dom';

export default function MenuItem({
  icon: Icon,
  text,
  to,
  rightElement,
  isActive,
  disabled = false,
}) {
  const Container = disabled ? 'div' : Link;
  const containerProps = disabled
    ? { className: 'flex items-center justify-between px-4 py-3 cursor-not-allowed opacity-50' }
    : {
        to,
        className: `flex items-center justify-between px-4 py-3 cursor-pointer transition-colors hover:bg-gray-50 ${
          isActive ? 'bg-gray-50 text-yellow-500' : ''
        } ${isActive && !rightElement ? 'border-r-2 border-yellow-500' : ''}`,
      };

  const iconClass = disabled
    ? 'text-gray-400'
    : isActive
    ? 'text-yellow-500'
    : 'text-gray-500';

  const textClass = disabled
    ? 'text-sm text-gray-400'
    : `text-sm ${isActive ? 'text-yellow-500 font-medium' : 'text-gray-700'}`;

  const rightClass =
    disabled && rightElement === 'notification'
      ? 'text-gray-400 opacity-50'
      : 'text-gray-400';

  return (
    <Container {...containerProps}>
      <div className="flex items-center space-x-3">
        <Icon size={20} className={iconClass} />
        <span className={textClass}>{text}</span>
      </div>
      {rightElement && (
        <div className={!disabled ? undefined : rightClass}>{rightElement}</div>
      )}
    </Container>
  );
}
