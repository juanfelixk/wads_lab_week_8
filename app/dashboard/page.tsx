import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckSquare2, TrendingUp, Zap } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-slate-50 mb-2">Overview</h1>
        <p className="text-slate-400">Welcome back! Here's your task management dashboard.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {[
          { icon: CheckSquare2, label: "Tasks Created", value: "0", color: "emerald" },
          { icon: TrendingUp, label: "Completed", value: "0", color: "blue" },
          { icon: Zap, label: "In Progress", value: "0", color: "amber" },
        ].map((stat, i) => {
          const Icon = stat.icon;
          const colorClasses = {
            emerald: "bg-emerald-600/10 text-emerald-400",
            blue: "bg-blue-600/10 text-blue-400",
            amber: "bg-amber-600/10 text-amber-400",
          };
          return (
            <Card key={i} className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-300 flex items-center justify-between">
                  {stat.label}
                  <div className={`p-2 rounded-lg ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-50">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Welcome Section */}
      <Card className="bg-linear-to-r from-slate-800 to-slate-700 border-slate-600">
        <CardHeader>
          <CardTitle className="text-slate-50">Get Started</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-300">
            Start managing your tasks efficiently. Create your first todo and organize your workflow.
          </p>
          <Link href="/dashboard/todos">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              Go to Todos
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}