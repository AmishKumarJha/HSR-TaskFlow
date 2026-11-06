
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  LogOut,
  CheckSquare,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Projects",
      path: "/projects",
      icon: FolderKanban,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      {/* Sidebar */}
      <aside className="flex w-full flex-col bg-slate-950 text-white md:fixed md:inset-y-0 md:w-64">
        <div className="flex items-center gap-3 border-b border-white/10 px-6 py-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 font-bold">
            T
          </div>
          <span className="text-xl font-bold">TaskFlow</span>
        </div>

        <nav className="flex gap-2 overflow-x-auto p-4 md:flex-1 md:flex-col">
          <p className="hidden px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-500 md:block">
            Workspace
          </p>

          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-indigo-600 text-white"
                      : "text-slate-400 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <Icon size={19} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        <div className="hidden border-t border-white/10 p-4 md:block">
          <div className="mb-4 flex items-center gap-3 px-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 font-semibold">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                {user?.name || "User"}
              </p>
              <p className="truncate text-xs text-slate-400">
                {user?.email || ""}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="min-w-0 flex-1 md:ml-64">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-8">
          <div>
            <p className="text-sm text-slate-500">Workspace</p>
            <h1 className="text-lg font-bold text-slate-900">
              Task Management
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <span className="hidden text-sm font-medium text-slate-700 sm:block">
              {user?.name || "User"}
            </span>
          </div>
        </header>

        <div className="p-5 sm:p-8">
          {children}
        </div>

        {/* Mobile sign out */}
        <div className="border-t border-slate-200 p-4 md:hidden">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-medium text-red-600"
          >
            <LogOut size={17} />
            Sign out
          </button>
        </div>
      </main>
    </div>
  );
}
