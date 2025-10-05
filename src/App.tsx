import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { UploadSection } from './components/UploadSection';
import { DatasetList } from './components/DatasetList';
import { ResultsDashboard } from './components/ResultsDashboard';
import { AnalysisProgress } from './components/AnalysisProgress';
import type { Database as DB } from './lib/database.types';
import { simulateMLAnalysis, parseCSVSampleCount, type AnalysisProgress as AnalysisProgressType } from './utils/mockAnalysis';

type Dataset = DB['public']['Tables']['datasets']['Row'];
type Candidate = DB['public']['Tables']['exoplanet_candidates']['Row'];
type ModelRun = DB['public']['Tables']['model_runs']['Row'];

function App() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [modelRuns, setModelRuns] = useState<ModelRun[]>([]);
  const [analyzing, setAnalyzing] = useState<string | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState<AnalysisProgressType | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const storedDatasets = localStorage.getItem('datasets');
    const storedCandidates = localStorage.getItem('candidates');
    const storedModelRuns = localStorage.getItem('modelRuns');

    if (storedDatasets) setDatasets(JSON.parse(storedDatasets));
    if (storedCandidates) setCandidates(JSON.parse(storedCandidates));
    if (storedModelRuns) setModelRuns(JSON.parse(storedModelRuns));
  };

  const handleUpload = async (file: File, missionSource: string, datasetName: string) => {
    const sampleCount = await parseCSVSampleCount(file);

    const newDataset: Dataset = {
      id: crypto.randomUUID(),
      name: datasetName,
      mission_source: missionSource,
      file_url: null,
      uploaded_at: new Date().toISOString(),
      total_samples: sampleCount,
      processed: false,
      user_id: 'demo-user'
    };

    const updatedDatasets = [...datasets, newDataset];
    setDatasets(updatedDatasets);
    localStorage.setItem('datasets', JSON.stringify(updatedDatasets));

    await handleAnalyze(newDataset.id, file, sampleCount);
  };

  const handleAnalyze = async (datasetId: string, file?: File, sampleCount?: number) => {
    setAnalyzing(datasetId);

    const dataset = datasets.find(d => d.id === datasetId);
    if (!dataset) return;

    try {
      const result = await simulateMLAnalysis(
        file || new File([], 'data.csv'),
        sampleCount || dataset.total_samples,
        (progress) => setAnalysisProgress(progress)
      );

      const newCandidates: Candidate[] = result.candidates.map(c => ({
        id: crypto.randomUUID(),
        dataset_id: datasetId,
        candidate_name: c.candidate_name,
        confidence_score: c.confidence_score,
        classification: c.classification,
        detection_method: c.detection_method,
        orbital_period: c.orbital_period,
        planet_radius: c.planet_radius,
        stellar_magnitude: c.stellar_magnitude,
        features: c.features as Record<string, number>,
        detected_at: new Date().toISOString(),
        user_id: 'demo-user'
      }));

      const newModelRun: ModelRun = {
        id: crypto.randomUUID(),
        dataset_id: datasetId,
        model_version: 'v1.0',
        accuracy: result.modelMetrics.accuracy,
        precision_score: result.modelMetrics.precision_score,
        recall_score: result.modelMetrics.recall_score,
        f1_score: result.modelMetrics.f1_score,
        total_predictions: result.modelMetrics.total_predictions,
        exoplanet_count: result.modelMetrics.exoplanet_count,
        false_positive_count: result.modelMetrics.false_positive_count,
        execution_time: result.modelMetrics.execution_time,
        started_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
        user_id: 'demo-user'
      };

      const updatedCandidates = [...candidates, ...newCandidates];
      const updatedModelRuns = [newModelRun, ...modelRuns];
      const updatedDatasets = datasets.map(d =>
        d.id === datasetId ? { ...d, processed: true } : d
      );

      setCandidates(updatedCandidates);
      setModelRuns(updatedModelRuns);
      setDatasets(updatedDatasets);

      localStorage.setItem('candidates', JSON.stringify(updatedCandidates));
      localStorage.setItem('modelRuns', JSON.stringify(updatedModelRuns));
      localStorage.setItem('datasets', JSON.stringify(updatedDatasets));
    } finally {
      setAnalyzing(null);
      setAnalysisProgress(null);
    }
  };

  const handleDelete = async (datasetId: string) => {
    const updatedDatasets = datasets.filter(d => d.id !== datasetId);
    const updatedCandidates = candidates.filter(c => c.dataset_id !== datasetId);
    const updatedModelRuns = modelRuns.filter(m => m.dataset_id !== datasetId);

    setDatasets(updatedDatasets);
    setCandidates(updatedCandidates);
    setModelRuns(updatedModelRuns);

    localStorage.setItem('datasets', JSON.stringify(updatedDatasets));
    localStorage.setItem('candidates', JSON.stringify(updatedCandidates));
    localStorage.setItem('modelRuns', JSON.stringify(updatedModelRuns));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />

      <main className="container mx-auto px-6 py-8">
        <div className="mb-8 bg-gradient-to-r from-white to-slate-50 rounded-2xl shadow-xl p-8 border-l-4 border-cyan-500 hover:shadow-2xl transition-shadow duration-300">
          <h2 className="text-xl font-bold text-slate-900 mb-3">About This System</h2>
          <p className="text-slate-600 leading-relaxed text-base">
            This AI-powered exoplanet detection system analyzes data from space-based missions like Kepler, TESS, and K2.
            Upload your dataset to automatically identify exoplanet candidates using machine learning algorithms trained
            on NASA's open-source exoplanet archives. The system provides confidence scores, orbital parameters, and
            detailed analysis metrics for each detection.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-1">
            <UploadSection onUpload={handleUpload} />
          </div>
          <div className="lg:col-span-2">
            <DatasetList
              datasets={datasets}
              onAnalyze={handleAnalyze}
              onDelete={handleDelete}
              analyzing={analyzing}
            />
          </div>
        </div>

        <ResultsDashboard candidates={candidates} modelRuns={modelRuns} />
      </main>

      <footer className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-slate-400 py-8 mt-16 border-t border-slate-700">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm font-medium">
            Powered by AI/ML trained on NASA Exoplanet Archive data
          </p>
          <p className="text-xs text-slate-500 mt-2">
            Neural Network v1.0 | Transit Detection Method
          </p>
        </div>
      </footer>

      {analysisProgress && (
        <AnalysisProgress
          stage={analysisProgress.stage}
          progress={analysisProgress.progress}
          streamData={analysisProgress.streamData}
        />
      )}
    </div>
  );
}

export default App;
