
import { LoaderCircle } from "lucide-react";

export default function LoadingSpinner({
  label = "Loading...",
  fullScreen = false,
}) {
  return (
    <div
      className={`flex items-center justify-center gap-3 ${
        fullScreen ? "min-h-[60vh]" : "py-8"
      }`}
      role="status"
      aria-label={label}
    >
      <LoaderCircle
        size={22}
        className="animate-spin text-indigo-600"
      />
      <span className="text-sm font-medium text-slate-500">
        {label}
      </span>
    </div>
  );
}
