export default function CategoryHeader({ title }) {
  return (
    <div className="px-4 py-2 mt-4 first:mt-0">
      <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
        {title}
      </span>
    </div>
  );
}
