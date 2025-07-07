export default function NotificationBadge({ count }) {
  return (
    <div className="bg-orange-100 text-red-900 text-sm font-semibold rounded-lg px-2 py-1">
      {count}
    </div>
  );
}