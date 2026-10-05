"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock } from "lucide-react";

export default function DashboardLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) throw new Error("Incorrect Admin Password.");

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#080808] flex items-center justify-center p-6 selection:bg-amber-400 selection:text-black">
      <div className="w-full max-w-md bg-[#0c0c0c] border border-white/10 p-8 md:p-10 rounded-sm shadow-2xl space-y-8">
        
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full border border-amber-400/40 flex items-center justify-center bg-amber-400/10 mb-4">
            <ShieldCheck className="w-6 h-6 text-amber-400" />
          </div>
          <h1 className="text-2xl font-serif text-white uppercase tracking-wider">
            SYSTEM CONTROL
          </h1>
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-1">
            RESTRICTED ACCESS // ABBES PORTFOLIO
          </span>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block mb-2">
              ADMIN PASSCODE
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#080808] border border-white/10 px-4 py-3 pl-10 text-sm font-mono text-white placeholder:text-zinc-700 focus:outline-none focus:border-amber-400 transition-colors"
              />
              <Lock className="w-4 h-4 text-zinc-600 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {error && (
            <div className="text-xs font-mono text-red-400 bg-red-950/40 border border-red-800/50 p-3">
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-amber-400 text-black font-mono text-xs uppercase font-bold tracking-widest hover:bg-white transition-colors disabled:opacity-50"
          >
            {loading ? "AUTHENTICATING..." : "ENTER DASHBOARD"}
          </button>
        </form>

      </div>
    </main>
  );
}