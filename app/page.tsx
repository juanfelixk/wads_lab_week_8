import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">T</span>
          </div>
          <span className="text-xl font-bold text-slate-50">Taskly</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-slate-300 hover:text-emerald-400 hover:bg-transparent">
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-8 py-24">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-50 leading-tight">
              Manage Your Tasks Efficiently
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl">
              Taskly helps you organize, prioritize, and accomplish your goals with a professional task management platform.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <Link href="/register">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-lg rounded-lg flex items-center gap-2">
                Start Free <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-6 text-lg rounded-lg">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          {[
            { title: "Easy to Use", desc: "Intuitive interface for quick task management" },
            { title: "Real-time Sync", desc: "Your tasks sync instantly across devices" },
            { title: "Secure", desc: "Enterprise-grade security for your data" },
          ].map((feature, i) => (
            <div key={i} className="p-6 bg-slate-800 border border-slate-700 rounded-lg hover:border-emerald-500 transition">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                <h3 className="font-semibold text-slate-50">{feature.title}</h3>
              </div>
              <p className="text-slate-400 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}