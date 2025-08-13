import FileList from "./FilesList";

export default function FilesDashboard() {
  return (
    <div className="bg-white rounded-sm shadow-sm border border-gray-200 w-full">
      <div className="px-1 sm:px-4 py-2 sm:py-3 border-b border-gray-200 bg-gray-50">
        <h2 className="text-[14px] sm:text-lg font-semibold text-gray-900">Files</h2>
        <p className="text-gray-500 text-sm">You have new notifications.</p>
      </div>
      
      <div className = "p-4">
        <div className = "max-h-[400px] overflow-y-auto border border-gray-200 rounded-lg">
         <FileList/>
        </div>
      </div>
    </div>
  );
}