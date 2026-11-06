
import { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function ProjectModal({
  isOpen,
  onClose,
  onSubmit,
  project,
  saving,
}) {
  const [form, setForm] = useState({
    title: "",
    description: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setForm({
        title: project?.title || "",
        description: project?.description || "",
      });
      setError("");
    }
  }, [isOpen, project]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.title.trim().length < 1) {
      setError("Project title is required.");
      return;
    }

    if (form.title.trim().length > 100) {
      setError("Project title cannot exceed 100 characters.");
      return;
    }

    try {
      setError("");
      await onSubmit({
        title: form.title.trim(),
        description: form.description.trim(),
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to save project. Please try again."
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !saving) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2
              id="project-modal-title"
              className="text-xl font-bold text-slate-900"
            >
              {project ? "Edit project" : "Create new project"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {project
                ? "Update your project details."
                : "Add a new project to your workspace."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close modal"
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="project-title"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Project title
            </label>

            <input
              id="project-title"
              type="text"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
              placeholder="e.g. Website Redesign"
              maxLength={100}
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />

            <p className="mt-1 text-right text-xs text-slate-400">
              {form.title.length}/100
            </p>
          </div>

          <div>
            <label
              htmlFor="project-description"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Description
            </label>

            <textarea
              id="project-description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="What is this project about?"
              rows={4}
              maxLength={1000}
              className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />

            <p className="mt-1 text-right text-xs text-slate-400">
              {form.description.length}/1000
            </p>
          </div>

          {error && (
            <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : project
                  ? "Save changes"
                  : "Create project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
