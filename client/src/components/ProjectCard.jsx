
import {
  FolderKanban,
  MoreVertical,
  Pencil,
  Trash2,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function ProjectCard({
  project,
  onEdit,
  onDelete,
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const updatedDate = project.updatedAt
    ? new Date(project.updatedAt).toLocaleDateString()
    : "Recently";

  return (
    <article className="group relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <FolderKanban size={24} />
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={`Actions for ${project.title}`}
            aria-expanded={menuOpen}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <MoreVertical size={19} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-10 z-10 w-40 rounded-xl border border-slate-200 bg-white p-1 shadow-xl">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onEdit(project);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                <Pencil size={15} />
                Edit project
              </button>

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onDelete(project);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <Trash2 size={15} />
                Delete project
              </button>
            </div>
          )}
        </div>
      </div>

      <Link
        to={`/projects/${project._id}`}
        className="mt-5 block"
      >
        <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 transition group-hover:text-indigo-700">
          <span className="truncate">{project.title}</span>
          <ArrowUpRight
            size={17}
            className="shrink-0 opacity-0 transition group-hover:opacity-100"
          />
        </h3>

        <p className="mt-2 min-h-10 line-clamp-2 text-sm leading-5 text-slate-500">
          {project.description || "No description added yet."}
        </p>
      </Link>

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
          Active
        </span>

        <span className="text-xs text-slate-400">
          Updated {updatedDate}
        </span>
      </div>
    </article>
  );
}
