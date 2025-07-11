import { AlertCircle, CheckCircle } from 'lucide-react';
export default function StatusBadge({ status }) {
  const isSuccess = status === "success";



  return (
    <span className={`inline-flex px-2 py-1`}>
      {isSuccess 
      ? <CheckCircle className="w-5 h-5 text-green-500" /> 
      : <AlertCircle className="w-5 h-5 text-red-500" />}
    </span>
  );
}
