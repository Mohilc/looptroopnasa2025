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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full p-4 sm:p-6 md:p-8 transform transition-all my-8">
        <div className="text-center mb-6 sm:mb-8">
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Analyzing Dataset</h3>
          <p className="text-sm sm:text-base text-slate-500">Processing exoplanet data with neural networks</p>
        </div>

        <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
          <StreamGraph data={streamData.signal} label="Signal Strength" color="#06b6d4" />
          <StreamGraph data={streamData.noise} label="Noise Filter" color="#eab308" />
          <StreamGraph data={streamData.confidence} label="Confidence Level" color="#10b981" />
        </div>

        <div className="space-y-3 sm:space-y-4 mb-6">
          {stages.map((stageInfo, index) => {
            const Icon = stageInfo.icon;
            const isActive = index === currentStageIndex;
            const isComplete = index < currentStageIndex;

            return (
              <div
                key={stageInfo.key}
                className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-300 shadow-lg sm:scale-105'
                    : isComplete
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-slate-50 border border-slate-200'
                }`}
              >
                <div
                  className={`p-2 sm:p-3 rounded-lg ${
                    isActive
                      ? 'bg-cyan-500 text-white animate-pulse'
                      : isComplete
                      ? 'bg-green-500 text-white'
                      : 'bg-slate-300 text-slate-500'
                  }`}
                >
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-900 text-sm sm:text-base">{stageInfo.label}</div>
                  {isActive && (
                    <div className="text-xs sm:text-sm text-slate-500 mt-1">Processing...</div>
                  )}
                </div>
                {isComplete && (
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
                )}
              </div>
            );
          })}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="font-semibold text-slate-700">Overall Progress</span>
            <span className="text-cyan-600 font-bold text-sm sm:text-base">{progress}%</span>
          </div>
          <div className="relative h-2 sm:h-3 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500 ease-out"
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
