
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ListTodo,
  Plus,
  RefreshCw,
  Search,
} from "lucide-react";

import api from "../services/api";
import DashboardLayout from "../layouts/DashboardLayout";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";

export default function ProjectDetails() {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const loadProjectData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [projectsResponse, tasksResponse] = await Promise.all([
        api.get("/projects"),
        api.get(`/projects/${id}/tasks`),
      ]);

      const projects = projectsResponse.data.projects || [];
      const selectedProject = projects.find(
        (item) => item._id === id
      );

      if (!selectedProject) {
        setProject(null);
        setTasks([]);
        setError("Project not found or you do not have access to it.");
        return;
      }

      setProject(selectedProject);
      setTasks(tasksResponse.data.tasks || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load this project. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadProjectData();
  }, [loadProjectData]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.title
        .toLowerCase()
        .includes(search.trim().toLowerCase());

      const matchesStatus =
        statusFilter === "all" || task.status === statusFilter;

      const matchesPriority =
        priorityFilter === "all" || task.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, search, statusFilter, priorityFilter]);

  const openCreateModal = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleSaveTask = async (formData) => {
    try {
      setSaving(true);
      setNotice("");

      if (editingTask) {
        await api.put(`/tasks/${editingTask._id}`, formData);
        setNotice("Task updated successfully.");
      } else {
        await api.post(`/projects/${id}/tasks`, formData);
        setNotice("Task created successfully.");
      }

      setModalOpen(false);
      setEditingTask(null);
      await loadProjectData();
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTask = async (task) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${task.title}"?`
    );

    if (!confirmed) return;

    try {
      setNotice("");
      await api.delete(`/tasks/${task._id}`);
      setTasks((current) =>
        current.filter((item) => item._id !== task._id)
      );
      setNotice("Task deleted successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to delete this task."
      );
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      setError("");
      setNotice("");

      await api.patch(`/tasks/${taskId}/status`, { status });

      setTasks((current) =>
        current.map((task) =>
          task._id === taskId ? { ...task, status } : task
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to update task status."
      );
    }
  };

  const statusCounts = {
    todo: tasks.filter((task) => task.status === "todo").length,
    inProgress: tasks.filter(
      (task) => task.status === "in-progress"
    ).length,
    done: tasks.filter((task) => task.status === "done").length,
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-sm text-slate-500">Loading project...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-7">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600"
        >
          <ArrowLeft size={16} />
          Back to projects
        </Link>

        {error && (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            <span>{error}</span>
            <button
              type="button"
              onClick={loadProjectData}
              className="font-semibold underline"
            >
              Retry
            </button>
          </div>
        )}

        {project && (
          <>
            <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
              <div>
                <p className="text-sm font-medium text-indigo-600">
                  Project workspace
                </p>
                <h1 className="mt-2 break-words text-3xl font-bold tracking-tight text-slate-900">
                  {project.title}
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  {project.description || "Manage and track your project tasks."}
                </p>
              </div>

              <button
                type="button"
                onClick={openCreateModal}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
              >
                <Plus size={18} />
                Add task
              </button>
            </section>

            {notice && (
              <p className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {notice}
              </p>
            )}

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                { label: "To do", count: statusCounts.todo },
                { label: "In progress", count: statusCounts.inProgress },
                { label: "Completed", count: statusCounts.done },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-slate-200 bg-white p-5"
                >
                  <p className="text-sm text-slate-500">{item.label}</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    {item.count}
                  </p>
                </div>
              ))}
            </section>

            <section className="space-y-5">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Tasks
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {filteredTasks.length} of {tasks.length} tasks
                  </p>
                </div>

                <button
                  type="button"
                  onClick={loadProjectData}
                  className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  <RefreshCw size={15} />
                  Refresh
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <div className="relative md:col-span-1">
                  <Search
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search tasks..."
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-500"
                >
                  <option value="all">All statuses</option>
                  <option value="todo">To do</option>
                  <option value="in-progress">In progress</option>
                  <option value="done">Done</option>
                </select>

                <select
                  value={priorityFilter}
                  onChange={(event) => setPriorityFilter(event.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-500"
                >
                  <option value="all">All priorities</option>
                  <option value="low">Low priority</option>
                  <option value="medium">Medium priority</option>
                  <option value="high">High priority</option>
                </select>
              </div>

              {tasks.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                  <ListTodo
                    size={34}
                    className="mx-auto text-slate-400"
                  />
                  <h3 className="mt-4 font-semibold text-slate-900">
                    No tasks yet
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">
                    Create your first task to start tracking this project.
                  </p>
                  <button
                    type="button"
                    onClick={openCreateModal}
                    className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                  >
                    Create your first task
                  </button>
                </div>
              ) : filteredTasks.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center">
                  <p className="font-semibold text-slate-800">
                    No matching tasks
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    Try changing your search or filters.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                  {filteredTasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onEdit={openEditModal}
                      onDelete={handleDeleteTask}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>

      <TaskModal
        isOpen={modalOpen}
        onClose={() => {
          if (!saving) {
            setModalOpen(false);
            setEditingTask(null);
          }
        }}
        onSubmit={handleSaveTask}
        task={editingTask}
        saving={saving}
      />
    </DashboardLayout>
  );
}
