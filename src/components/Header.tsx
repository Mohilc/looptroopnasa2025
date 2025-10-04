import { Telescope, Sparkles } from 'lucide-react';

export function Header() {
  return (
    <header className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>
      <div className="container mx-auto px-6 py-8 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-400 blur-xl opacity-30 animate-pulse"></div>
              <Telescope className="w-12 h-12 text-cyan-400 relative z-10" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">Exoplanet Detection System</h1>
                <Sparkles className="w-6 h-6 text-cyan-400 animate-pulse" />
              </div>
              <p className="text-slate-300 text-sm mt-2 font-light tracking-wide">AI-Powered Analysis of NASA Mission Data</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-cyan-400">ML v1.0</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider">Neural Network</div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
    </header>
  );
}
