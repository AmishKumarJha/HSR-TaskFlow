
import { useState } from "react";
import {
  CalendarDays,
  Check,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";

const statusLabels = {
  todo: "To do",
  "in-progress": "In progress",
  done: "Done",
};

const priorityStyles = {
  low: "bg-slate-100 text-slate-600",
  medium: "bg-amber-50 text-amber-700",
  high: "bg-red-50 text-red-700",
};

const statusStyles = {
  todo: "bg-slate-100 text-slate-600",
  "in-progress": "bg-blue-50 text-blue-700",
  done: "bg-emerald-50 text-emerald-700",
};

export default function TaskCard({
  task,
  onEdit,
  onDelete,
  onStatusChange,
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const dueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString()
    : null;

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "done";

  const nextStatus = {
    todo: "in-progress",
    "in-progress": "done",
    done: "todo",
  };

  return (
    <article className="relative rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-indigo-200 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="break-words font-semibold text-slate-900">
            {task.title}
          </h3>
          {task.description && (
            <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-slate-500">
              {task.description}
            </p>
          )}
        </div>

        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Task options"
          >
            <MoreHorizontal size={20} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-10 z-20 w-36 rounded-xl border border-slate-100 bg-white p-1 shadow-lg">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onEdit(task);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
              >
                <Pencil size={15} /> Edit
              </button>

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onDelete(task);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
              >
                <Trash2 size={15} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[task.status] || statusStyles.todo}`}
        >
          {statusLabels[task.status] || task.status}
        </span>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${priorityStyles[task.priority] || priorityStyles.medium}`}
        >
          {task.priority} priority
        </span>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <div className={`flex items-center gap-2 text-xs ${isOverdue ? "font-semibold text-red-600" : "text-slate-500"}`}>
          <CalendarDays size={15} />
          {dueDate ? (
            <span>{isOverdue ? "Overdue · " : "Due "}{dueDate}</span>
          ) : (
            <span>No due date</span>
          )}
        </div>

        <button
          type="button"
          onClick={() => onStatusChange(task._id, nextStatus[task.status] || "todo")}
          className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-indigo-600 hover:bg-indigo-50"
        >
          <Check size={14} />
          {task.status === "done" ? "Reopen" : "Move forward"}
        </button>
      </div>
    </article>
  );
}
