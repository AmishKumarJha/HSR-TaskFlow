
import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { CalendarDays, GripVertical } from "lucide-react";

const columns = [
  {
    id: "todo",
    title: "To do",
    color: "border-slate-300",
    dot: "bg-slate-400",
  },
  {
    id: "in-progress",
    title: "In progress",
    color: "border-blue-400",
    dot: "bg-blue-500",
  },
  {
    id: "done",
    title: "Done",
    color: "border-emerald-400",
    dot: "bg-emerald-500",
  },
];

function KanbanTask({ task, onEdit, onDelete, isOverlay = false }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: task._id,
    data: { task },
    disabled: isOverlay,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.35 : 1,
  };

  const priorityColor = {
    low: "bg-slate-100 text-slate-600",
    medium: "bg-amber-50 text-amber-700",
    high: "bg-red-50 text-red-700",
  };

  const dueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString()
    : null;

  const overdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "done";

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm ${
        isOverlay ? "rotate-2 shadow-xl" : "hover:border-indigo-200"
      }`}
    >
      <div className="flex items-start gap-2">
        <button
          type="button"
          {...listeners}
          {...attributes}
          className="mt-0.5 cursor-grab touch-none rounded p-1 text-slate-400 hover:bg-slate-100 active:cursor-grabbing"
          aria-label={`Drag ${task.title}`}
        >
          <GripVertical size={17} />
        </button>

        <div className="min-w-0 flex-1">
          <h3 className="break-words text-sm font-semibold text-slate-900">
            {task.title}
          </h3>

          {task.description && (
            <p className="mt-2 line-clamp-3 whitespace-pre-wrap break-words text-xs leading-5 text-slate-500">
              {task.description}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${
            priorityColor[task.priority] || priorityColor.medium
          }`}
        >
          {task.priority}
        </span>
      </div>

      {dueDate && (
        <div
          className={`mt-3 flex items-center gap-2 text-xs ${
            overdue ? "font-semibold text-red-600" : "text-slate-500"
          }`}
        >
          <CalendarDays size={13} />
          {overdue ? "Overdue · " : "Due "}
          {dueDate}
        </div>
      )}

      {!isOverlay && (
        <div className="mt-4 flex gap-3 border-t border-slate-100 pt-3">
          <button
            type="button"
            onClick={() => onEdit(task)}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(task)}
            className="text-xs font-semibold text-red-600 hover:text-red-800"
          >
            Delete
          </button>
        </div>
      )}
    </article>
  );
}

function KanbanColumn({ column, tasks, onEdit, onDelete }) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <section
      ref={setNodeRef}
      className={`min-h-64 rounded-2xl border-t-4 ${column.color} ${
        isOver ? "bg-indigo-50" : "bg-slate-50"
      } p-3 transition-colors`}
    >
      <div className="mb-4 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${column.dot}`} />
          <h3 className="text-sm font-bold text-slate-800">
            {column.title}
          </h3>
        </div>

        <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-600">
          {tasks.length}
        </span>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <KanbanTask
            key={task._id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}

        {tasks.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-300 px-3 py-8 text-center text-xs text-slate-400">
            Drop tasks here
          </div>
        )}
      </div>
    </section>
  );
}

export default function KanbanBoard({
  tasks,
  onEdit,
  onDelete,
  onStatusChange,
}) {
  const [activeTask, setActiveTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    })
  );

  const handleDragStart = ({ active }) => {
    setActiveTask(active.data.current?.task || null);
  };

  const handleDragEnd = async ({ active, over }) => {
    setActiveTask(null);

    if (!over) return;

    const task = active.data.current?.task;
    const newStatus = String(over.id);

    if (!task || !columns.some((column) => column.id === newStatus)) {
      return;
    }

    if (task.status !== newStatus) {
      await onStatusChange(task._id, newStatus);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragCancel={() => setActiveTask(null)}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            tasks={tasks.filter((task) => task.status === column.id)}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask ? (
          <KanbanTask task={activeTask} isOverlay />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
