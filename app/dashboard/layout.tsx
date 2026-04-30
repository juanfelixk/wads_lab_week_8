import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import LogoutButton from "@/components/ui/logout-button";
import { LayoutGrid, CheckSquare2, LogOut } from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="flex h-screen bg-background">
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-slate-700 bg-slate-900 flex flex-col p-6">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">T</span>
          </div>
          <span className="text-lg font-bold text-slate-50">Taskly</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-emerald-400 rounded-lg transition group"
          >
            <LayoutGrid className="w-5 h-5 group-hover:text-emerald-500" />
            <span>Overview</span>
          </Link>
          <Link
            href="/dashboard/todos"
            className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-emerald-400 rounded-lg transition group"
          >
            <CheckSquare2 className="w-5 h-5 group-hover:text-emerald-500" />
            <span>Todos</span>
          </Link>
        </nav>

        {/* User Section */}
        <div className="border-t border-slate-700 pt-4 space-y-3">
          <div className="px-4">
            <p className="text-xs text-slate-500 mb-1">Signed in as</p>
            <p className="text-sm font-medium text-slate-200 truncate">{session.email}</p>
          </div>
          <LogoutButton />
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}