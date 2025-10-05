export interface AnalysisResult {
  candidates: Array<{
    candidate_name: string;
    confidence_score: number;
    classification: 'exoplanet' | 'false_positive';
    detection_method: string;
    orbital_period: number | null;
    planet_radius: number | null;
    stellar_magnitude: number | null;
    features: Record<string, unknown>;
  }>;
  modelMetrics: {
    accuracy: number;
    precision_score: number;
    recall_score: number;
    f1_score: number;
    total_predictions: number;
    exoplanet_count: number;
    false_positive_count: number;
    execution_time: number;
  };
}

export interface AnalysisProgress {
  stage: 'loading' | 'processing' | 'analyzing' | 'complete';
  progress: number;
  streamData: {
    signal: number[];
    noise: number[];
    confidence: number[];
  };
}

function generateRandomCandidate(index: number): AnalysisResult['candidates'][0] {
  const isExoplanet = Math.random() > 0.3;
  const confidence = isExoplanet
    ? 0.65 + Math.random() * 0.35
    : 0.3 + Math.random() * 0.4;

  return {
    candidate_name: `KOI-${1000 + index}`,
    confidence_score: Math.round(confidence * 10000) / 10000,
    classification: isExoplanet ? 'exoplanet' : 'false_positive',
    detection_method: 'transit',
    orbital_period: isExoplanet ? 1 + Math.random() * 500 : null,
    planet_radius: isExoplanet ? 0.5 + Math.random() * 15 : null,
    stellar_magnitude: 10 + Math.random() * 8,
    features: {
      transit_depth: Math.random() * 0.05,
      transit_duration: Math.random() * 10,
      signal_to_noise: 5 + Math.random() * 15
    }
  };
}

function generateStreamData(length: number = 100): number[] {
  return Array.from({ length }, (_, i) => Math.sin(i / 10) + Math.random() * 0.5 - 0.25);
}

export async function simulateMLAnalysis(
  _file: File,
  totalSamples: number,
  onProgress?: (progress: AnalysisProgress) => void
): Promise<AnalysisResult> {
  const stages: AnalysisProgress['stage'][] = ['loading', 'processing', 'analyzing', 'complete'];

  for (let stageIndex = 0; stageIndex < stages.length; stageIndex++) {
    const stage = stages[stageIndex];
    const stageProgress = stageIndex / stages.length;

    for (let step = 0; step <= 10; step++) {
      const progress = Math.floor((stageProgress + (step / 10) / stages.length) * 100);

      if (onProgress) {
        onProgress({
          stage,
          progress,
          streamData: {
            signal: generateStreamData(100),
            noise: generateStreamData(100),
            confidence: generateStreamData(100)
          }
        });
      }

      await new Promise(resolve => setTimeout(resolve, 150));
    }
  }

  const numCandidates = Math.min(Math.floor(totalSamples * 0.1), 50);
  const candidates = Array.from({ length: numCandidates }, (_, i) =>
    generateRandomCandidate(i)
  );

  const exoplanetCount = candidates.filter(c => c.classification === 'exoplanet').length;
  const falsePositiveCount = candidates.filter(c => c.classification === 'false_positive').length;

  return {
    candidates,
    modelMetrics: {
      accuracy: 0.92 + Math.random() * 0.06,
      precision_score: 0.88 + Math.random() * 0.08,
      recall_score: 0.85 + Math.random() * 0.10,
      f1_score: 0.87 + Math.random() * 0.08,
      total_predictions: numCandidates,
      exoplanet_count: exoplanetCount,
      false_positive_count: falsePositiveCount,
      execution_time: 1500 + Math.floor(Math.random() * 1000)
    }
  };
}

export function parseCSVSampleCount(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());
      resolve(Math.max(1, lines.length - 1));
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
