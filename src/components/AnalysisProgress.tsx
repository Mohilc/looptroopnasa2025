import { Brain, Zap, Database, CheckCircle2 } from 'lucide-react';
import { StreamGraph } from './StreamGraph';

interface AnalysisProgressProps {
  stage: 'loading' | 'processing' | 'analyzing' | 'complete';
  progress: number;
  streamData: {
    signal: number[];
    noise: number[];
    confidence: number[];
  };
}

export function AnalysisProgress({ stage, progress, streamData }: AnalysisProgressProps) {
  const stages = [
    { key: 'loading', icon: Database, label: 'Loading Data', color: 'text-blue-500' },
    { key: 'processing', icon: Zap, label: 'Processing Features', color: 'text-yellow-500' },
    { key: 'analyzing', icon: Brain, label: 'ML Analysis', color: 'text-cyan-500' },
    { key: 'complete', icon: CheckCircle2, label: 'Complete', color: 'text-green-500' },
  ];

  const currentStageIndex = stages.findIndex(s => s.key === stage);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-4 sm:p-6 transform transition-all">
        <div className="text-center mb-4">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">Analyzing Dataset</h3>
          <p className="text-xs sm:text-sm text-slate-500">Processing with neural networks</p>
        </div>

        <div className="space-y-3 mb-4">
          <StreamGraph data={streamData.signal} label="Signal" color="#8b5cf6" />
          <StreamGraph data={streamData.confidence} label="Confidence" color="#10b981" />
        </div>

        <div className="grid grid-cols-4 gap-2 mb-4">
          {stages.map((stageInfo, index) => {
            const Icon = stageInfo.icon;
            const isActive = index === currentStageIndex;
            const isComplete = index < currentStageIndex;

            return (
              <div
                key={stageInfo.key}
                className={`flex flex-col items-center gap-2 p-2 sm:p-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-violet-100 border-2 border-violet-400 scale-105'
                    : isComplete
                    ? 'bg-emerald-100 border border-emerald-300'
                    : 'bg-slate-100 border border-slate-200'
                }`}
              >
                <div
                  className={`p-2 rounded-lg ${
                    isActive
                      ? 'bg-violet-500 text-white animate-pulse'
                      : isComplete
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-300 text-slate-500'
                  }`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="text-center">
                  <div className="font-semibold text-slate-900 text-xs">{stageInfo.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="font-semibold text-slate-700">Progress</span>
            <span className="text-violet-600 font-bold">{progress}%</span>
          </div>
          <div className="relative h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
