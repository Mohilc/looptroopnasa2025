import { Database, FileText, Trash2 } from 'lucide-react';
import type { Database as DB } from '../lib/database.types';

type Dataset = DB['public']['Tables']['datasets']['Row'];

interface DatasetListProps {
  datasets: Dataset[];
  onDelete: (datasetId: string) => void;
  analyzing: string | null;
}

export function DatasetList({ datasets, onDelete, analyzing }: DatasetListProps) {
  if (datasets.length === 0) {
    return (
      <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-xl p-8 border border-slate-200">
        <div className="text-center py-16">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-cyan-400 blur-2xl opacity-20 animate-pulse"></div>
            <Database className="w-20 h-20 text-slate-300 relative z-10" />
          </div>
          <p className="text-slate-600 text-xl font-semibold mb-2">No datasets uploaded yet</p>
          <p className="text-slate-400 text-sm">Upload a dataset to get started with exoplanet detection</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg">
          <Database className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Datasets</h2>
      </div>
      <div className="space-y-4">
        {datasets.map((dataset) => (
          <div
            key={dataset.id}
            className="flex items-center justify-between p-5 border-2 border-slate-200 rounded-xl hover:border-violet-400 hover:shadow-lg transition-all duration-300 bg-gradient-to-r hover:from-violet-50 hover:to-fuchsia-50"
          >
            <div className="flex items-center gap-4 flex-1">
              <div className="p-3 bg-gradient-to-br from-violet-100 to-fuchsia-100 rounded-lg">
                <FileText className="w-8 h-8 text-violet-600 flex-shrink-0" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-900 truncate text-lg">{dataset.name}</h3>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-sm text-slate-600 font-medium px-2 py-1 bg-slate-100 rounded">{dataset.mission_source}</span>
                  <span className="text-sm text-slate-500 font-medium">
                    {dataset.total_samples.toLocaleString()} samples
                  </span>
                  {analyzing === dataset.id && (
                    <span className="text-xs bg-gradient-to-r from-violet-400 to-fuchsia-500 text-white px-3 py-1 rounded-full font-bold shadow-sm animate-pulse">
                      Analyzing...
                    </span>
                  )}
                  {dataset.processed && analyzing !== dataset.id && (
                    <span className="text-xs bg-gradient-to-r from-green-400 to-emerald-500 text-white px-3 py-1 rounded-full font-bold shadow-sm">
                      Analyzed
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onDelete(dataset.id)}
                disabled={analyzing === dataset.id}
                className="p-3 text-red-600 hover:bg-red-100 rounded-xl transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Delete dataset"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
