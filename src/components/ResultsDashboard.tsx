import { Activity, Target, TrendingUp, BarChart3 } from 'lucide-react';
import type { Database as DB } from '../lib/database.types';

type Candidate = DB['public']['Tables']['exoplanet_candidates']['Row'];
type ModelRun = DB['public']['Tables']['model_runs']['Row'];

interface ResultsDashboardProps {
  candidates: Candidate[];
  modelRuns: ModelRun[];
}

export function ResultsDashboard({ candidates, modelRuns }: ResultsDashboardProps) {
  const exoplanetCount = candidates.filter(c => c.classification === 'exoplanet').length;
  const falsePositiveCount = candidates.filter(c => c.classification === 'false_positive').length;

  const latestRun = modelRuns.length > 0 ? modelRuns[0] : null;
  const avgConfidence = candidates.length > 0
    ? candidates.reduce((sum, c) => sum + c.confidence_score, 0) / candidates.length
    : 0;

  const highConfidenceCandidates = candidates
    .filter(c => c.classification === 'exoplanet' && c.confidence_score >= 0.8)
    .sort((a, b) => b.confidence_score - a.confidence_score)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="relative overflow-hidden bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                <Target className="w-8 h-8" />
              </div>
              <span className="text-4xl font-bold">{exoplanetCount}</span>
            </div>
            <p className="text-cyan-50 font-semibold text-sm uppercase tracking-wider">Exoplanets Detected</p>
          </div>
        </div>

        <div className="relative overflow-hidden bg-gradient-to-br from-slate-500 to-slate-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                <Activity className="w-8 h-8" />
              </div>
              <span className="text-4xl font-bold">{falsePositiveCount}</span>
            </div>
            <p className="text-slate-50 font-semibold text-sm uppercase tracking-wider">False Positives</p>
          </div>
        </div>

        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                <TrendingUp className="w-8 h-8" />
              </div>
              <span className="text-4xl font-bold">{(avgConfidence * 100).toFixed(1)}%</span>
            </div>
            <p className="text-emerald-50 font-semibold text-sm uppercase tracking-wider">Avg Confidence</p>
          </div>
        </div>

        <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                <BarChart3 className="w-8 h-8" />
              </div>
              <span className="text-4xl font-bold">
                {latestRun ? (latestRun.accuracy ? (latestRun.accuracy * 100).toFixed(1) + '%' : 'N/A') : 'N/A'}
              </span>
            </div>
            <p className="text-blue-50 font-semibold text-sm uppercase tracking-wider">Model Accuracy</p>
          </div>
        </div>
      </div>

      {highConfidenceCandidates.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Top Exoplanet Candidates</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-slate-200 bg-slate-50">
                  <th className="text-left py-4 px-4 font-bold text-slate-700 uppercase tracking-wide text-xs">Candidate</th>
                  <th className="text-left py-4 px-4 font-bold text-slate-700 uppercase tracking-wide text-xs">Confidence</th>
                  <th className="text-left py-4 px-4 font-bold text-slate-700 uppercase tracking-wide text-xs">Orbital Period</th>
                  <th className="text-left py-4 px-4 font-bold text-slate-700 uppercase tracking-wide text-xs">Radius</th>
                  <th className="text-left py-4 px-4 font-bold text-slate-700 uppercase tracking-wide text-xs">Method</th>
                </tr>
              </thead>
              <tbody>
                {highConfidenceCandidates.map((candidate) => (
                  <tr
                    key={candidate.id}
                    className="border-b border-slate-100 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 transition-all duration-200"
                  >
                    <td className="py-4 px-4 font-medium text-slate-900">{candidate.candidate_name}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-cyan-600 h-2 rounded-full transition-all"
                            style={{ width: `${candidate.confidence_score * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-slate-700">
                          {(candidate.confidence_score * 100).toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-600">
                      {candidate.orbital_period ? `${candidate.orbital_period.toFixed(2)} days` : 'N/A'}
                    </td>
                    <td className="py-4 px-4 text-slate-600">
                      {candidate.planet_radius ? `${candidate.planet_radius.toFixed(2)} R⊕` : 'N/A'}
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-xs bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700 px-3 py-1 rounded-full font-semibold">
                        {candidate.detection_method}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {latestRun && (
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Latest Model Run</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
              <p className="text-xs text-slate-600 mb-2 font-bold uppercase tracking-wider">Model Version</p>
              <p className="text-2xl font-bold text-slate-900">{latestRun.model_version}</p>
            </div>
            <div className="p-5 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
              <p className="text-xs text-slate-600 mb-2 font-bold uppercase tracking-wider">Precision</p>
              <p className="text-2xl font-bold text-slate-900">
                {latestRun.precision_score ? (latestRun.precision_score * 100).toFixed(1) + '%' : 'N/A'}
              </p>
            </div>
            <div className="p-5 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
              <p className="text-xs text-slate-600 mb-2 font-bold uppercase tracking-wider">Recall</p>
              <p className="text-2xl font-bold text-slate-900">
                {latestRun.recall_score ? (latestRun.recall_score * 100).toFixed(1) + '%' : 'N/A'}
              </p>
            </div>
            <div className="p-5 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
              <p className="text-xs text-slate-600 mb-2 font-bold uppercase tracking-wider">F1 Score</p>
              <p className="text-2xl font-bold text-slate-900">
                {latestRun.f1_score ? (latestRun.f1_score * 100).toFixed(1) + '%' : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      )}

      {candidates.length === 0 && modelRuns.length === 0 && (
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="text-center py-12">
            <Activity className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">No analysis results yet</p>
            <p className="text-slate-400 text-sm mt-2">Upload and analyze a dataset to see results</p>
          </div>
        </div>
      )}
    </div>
  );
}
