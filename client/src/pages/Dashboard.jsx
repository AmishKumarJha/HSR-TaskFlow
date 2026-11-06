
import { useEffect, useState } from "react";
import {
  FolderKanban,
  ListTodo,
  Clock3,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";

import api from "../services/api";
import DashboardLayout from "../layouts/DashboardLayout";
import StatCard from "../components/StatCard";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [dashboardResponse, projectsResponse] =
        await Promise.all([
          api.get("/dashboard"),
          api.get("/projects"),
        ]);

      setStats(dashboardResponse.data.stats);
      setProjects(projectsResponse.data.projects || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to load dashboard. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const statusItems = [
    {
      label: "To do",
      value: stats?.tasksByStatus?.todo ?? 0,
      color: "bg-slate-400",
      textColor: "text-slate-600",
    },
    {
      label: "In progress",
      value: stats?.tasksByStatus?.inProgress ?? 0,
      color: "bg-indigo-500",
      textColor: "text-indigo-600",
    },
    {
      label: "Completed",
      value: stats?.tasksByStatus?.completed ?? 0,
      color: "bg-emerald-500",
      textColor: "text-emerald-600",
    },
  ];

  const totalTasks = stats?.totalTasks ?? 0;

  return (
    <DashboardLayout>
      <div className="space-y-8">

        {/* Page heading */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-indigo-600">
              OVERVIEW
            </p>

            <h2 className="mt-1 text-3xl font-bold text-slate-900">
              Dashboard
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Here's what's happening with your workspace.
            </p>
          </div>

          <button
            onClick={fetchDashboard}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <RefreshCw className="mx-auto animate-spin text-indigo-600" size={28} />
            <p className="mt-3 text-sm text-slate-500">
              Loading your dashboard...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-5">
            <p className="font-semibold text-red-700">
              Something went wrong
            </p>
            <p className="mt-1 text-sm text-red-600">{error}</p>

            <button
              onClick={fetchDashboard}
              className="mt-3 text-sm font-semibold text-red-700 underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Dashboard data */}
        {!loading && !error && stats && (
          <>
            {/* Statistics */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="Total Projects"
                value={stats.totalProjects}
                icon={FolderKanban}
                description="Your active workspace projects"
                iconColor="text-indigo-600"
                iconBackground="bg-indigo-50"
              />

              <StatCard
                title="Total Tasks"
                value={stats.totalTasks}
                icon={ListTodo}
                description="Tasks across all your projects"
                iconColor="text-blue-600"
                iconBackground="bg-blue-50"
              />

              <StatCard
                title="In Progress"
                value={stats.tasksByStatus.inProgress}
                icon={Clock3}
                description="Tasks currently being worked on"
                iconColor="text-amber-600"
                iconBackground="bg-amber-50"
              />

              <StatCard
                title="Overdue Tasks"
                value={stats.overdueTasks}
                icon={AlertCircle}
                description="Unfinished tasks past their due date"
                iconColor="text-red-600"
                iconBackground="bg-red-50"
              />
            </div>

            {/* Progress and projects */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

              {/* Task progress */}
              <section className="rounded-2xl border border-slate-200 bg-white p-6 xl:col-span-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Task Progress
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Overview of your task status
                    </p>
                  </div>

                  <CheckCircle2 className="text-indigo-600" size={23} />
                </div>

                <div className="mt-8 space-y-6">
                  {statusItems.map((item) => {
                    const percentage = totalTasks
                      ? Math.round((item.value / totalTasks) * 100)
                      : 0;

                    return (
                      <div key={item.label}>
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-700">
                            {item.label}
                          </span>

                          <span className={`text-sm font-bold ${item.textColor}`}>
                            {item.value} ({percentage}%)
                          </span>
                        </div>

                        <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${item.color}`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 grid grid-cols-2 gap-3 border-t border-slate-100 pt-6">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">
                      Completed tasks
                    </p>
                    <p className="mt-1 text-2xl font-bold text-emerald-600">
                      {stats.tasksByStatus.completed}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">
                      Pending tasks
                    </p>
                    <p className="mt-1 text-2xl font-bold text-slate-700">
                      {stats.tasksByStatus.todo}
                    </p>
                  </div>
                </div>
              </section>

              {/* Project overview */}
              <section className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Your Projects
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Your workspace projects
                    </p>
                  </div>

                  <FolderKanban className="text-indigo-600" size={22} />
                </div>

                {projects.length === 0 ? (
                  <div className="py-10 text-center">
                    <FolderKanban
                      className="mx-auto text-slate-300"
                      size={35}
                    />
                    <p className="mt-3 text-sm text-slate-500">
                      No projects yet.
                    </p>
                  </div>
                ) : (
                  <div className="mt-5 space-y-3">
                    {projects.slice(0, 5).map((project) => (
                      <Link
                        key={project._id}
                        to={`/projects/${project._id}`}
                        className="block rounded-xl border border-slate-100 p-3 transition hover:border-indigo-200 hover:bg-indigo-50/50"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-semibold text-slate-800">
                            {project.title}
                          </p>
                          <ArrowRight
                            size={16}
                            className="shrink-0 text-slate-400"
                          />
                        </div>

                        <p className="mt-1 truncate text-xs text-slate-500">
                          {project.description || "No description"}
                        </p>
                      </Link>
                    ))}
                  </div>
                )}

                <Link
                  to="/projects"
                  className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-700"
                >
                  View all projects
                  <ArrowRight size={16} />
                </Link>
              </section>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
