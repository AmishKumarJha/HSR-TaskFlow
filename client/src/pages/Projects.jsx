
import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  RefreshCw,
  FolderPlus,
} from "lucide-react";

import api from "../services/api";
import DashboardLayout from "../layouts/DashboardLayout";
import ProjectCard from "../components/ProjectCard";
import ProjectModal from "../components/ProjectModal";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // Fetch projects
  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await api.get("/projects");

      setProjects(data.projects || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load projects. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProjects();
  }, []);

  // Open create modal
  const openCreateModal = () => {
    setSelectedProject(null);
    setModalOpen(true);
    setSuccess("");
    setError("");
  };

  // Open edit modal
  const openEditModal = (project) => {
    setSelectedProject(project);
    setModalOpen(true);
    setSuccess("");
    setError("");
  };

  // Create or update project
  const handleSaveProject = async (formData) => {
    try {
      setSaving(true);
      setError("");

      if (selectedProject) {
        const { data } = await api.put(
          `/projects/${selectedProject._id}`,
          formData
        );

        const updatedProject = data.project;

        if (updatedProject) {
          setProjects((prev) =>
            prev.map((project) =>
              project._id === selectedProject._id
                ? updatedProject
                : project
            )
          );
        } else {
          await fetchProjects();
        }

        setSuccess("Project updated successfully.");
      } else {
        const { data } = await api.post(
          "/projects",
          formData
        );

        if (data.project) {
          setProjects((prev) => [
            data.project,
            ...prev,
          ]);
        } else {
          await fetchProjects();
        }

        setSuccess("Project created successfully.");
      }

      setModalOpen(false);
      setSelectedProject(null);
    } finally {
      setSaving(false);
    }
  };

  // Delete project
  const handleDeleteProject = async (project) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${project.title}"? All tasks inside this project will also be deleted.`
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await api.delete(`/projects/${project._id}`);

      setProjects((prev) =>
        prev.filter((item) => item._id !== project._id)
      );

      setSuccess("Project deleted successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to delete project. Please try again."
      );
    }
  };

  // Search projects
  const filteredProjects = projects.filter((project) =>
    `${project.title} ${project.description || ""}`
      .toLowerCase()
      .includes(search.toLowerCase().trim())
  );

  return (
    <DashboardLayout>
      <div className="space-y-7">

        {/* Heading */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-indigo-600">
              WORKSPACE
            </p>

            <h2 className="mt-1 text-3xl font-bold text-slate-900">
              My Projects
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Create, organize and manage your projects.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            <Plus size={19} />
            New Project
          </button>
        </div>

        {/* Notifications */}
        {success && (
          <div
            role="status"
            className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
          >
            {success}
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <span>{error}</span>

            <button
              type="button"
              onClick={fetchProjects}
              className="font-semibold underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Search and count */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="relative w-full sm:max-w-sm">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              aria-label="Search projects"
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              {projects.length}{" "}
              {projects.length === 1 ? "project" : "projects"}
            </p>

            <button
              type="button"
              onClick={fetchProjects}
              disabled={loading}
              aria-label="Refresh projects"
              className="rounded-lg border border-slate-200 bg-white p-2.5 text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw
                size={17}
                className={loading ? "animate-spin" : ""}
              />
            </button>
          </div>
        </div>

        {/* Loading and project list */}
        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center">
            <RefreshCw
              size={28}
              className="mx-auto animate-spin text-indigo-600"
            />

            <p className="mt-3 text-sm text-slate-500">
              Loading projects...
            </p>
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                onEdit={openEditModal}
                onDelete={handleDeleteProject}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              {search ? (
                <Search size={28} />
              ) : (
                <FolderPlus size={28} />
              )}
            </div>

            <h3 className="mt-5 text-lg font-bold text-slate-900">
              {search ? "No projects found" : "No projects yet"}
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
              {search
                ? "Try another search term."
                : "Create your first project to start organizing your work."}
            </p>

            {!search && (
              <button
                type="button"
                onClick={openCreateModal}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                <Plus size={18} />
                Create your first project
              </button>
            )}
          </div>
        )}
      </div>

      {/* Project modal */}
      <ProjectModal
        isOpen={modalOpen}
        onClose={() => {
          if (!saving) {
            setModalOpen(false);
            setSelectedProject(null);
          }
        }}
        onSubmit={handleSaveProject}
        project={selectedProject}
        saving={saving}
      />
    </DashboardLayout>
  );
}
