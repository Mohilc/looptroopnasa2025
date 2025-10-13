import { useState } from 'react';
import { Upload, FileText, AlertCircle, Sparkles } from 'lucide-react';

interface UploadSectionProps {
  onUpload: (file: File, missionSource: string, datasetName: string) => Promise<void>;
}

export function UploadSection({ onUpload }: UploadSectionProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [missionSource, setMissionSource] = useState('Kepler');
  const [datasetName, setDatasetName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!datasetName) {
        setDatasetName(file.name.replace(/\.[^/.]+$/, ''));
      }
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !datasetName.trim()) {
      setError('Please select a file and provide a dataset name');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      await onUpload(selectedFile, missionSource, datasetName.trim());
      setSelectedFile(null);
      setDatasetName('');
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200 hover:shadow-2xl transition-shadow duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Upload Dataset</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide text-xs">
            Dataset Name
          </label>
          <input
            type="text"
            value={datasetName}
            onChange={(e) => setDatasetName(e.target.value)}
            placeholder="e.g., Kepler Q1-Q17 Light Curves"
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all hover:border-slate-300"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide text-xs">
            Mission Source
          </label>
          <select
            value={missionSource}
            onChange={(e) => setMissionSource(e.target.value)}
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all bg-white hover:border-slate-300 cursor-pointer"
          >
            <option value="Kepler">Kepler</option>
            <option value="TESS">TESS</option>
            <option value="K2">K2</option>
            <option value="CoRoT">CoRoT</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide text-xs">
            Data File (CSV)
          </label>
          <div className="relative">
            <input
              id="file-upload"
              type="file"
              accept=".csv,.txt"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="file-upload"
              className="flex items-center justify-center gap-3 w-full px-4 py-10 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-violet-500 hover:bg-gradient-to-br hover:from-violet-50 hover:to-fuchsia-50 transition-all duration-300 group"
            >
              {selectedFile ? (
                <>
                  <FileText className="w-8 h-8 text-cyan-600" />
                  <div className="text-center">
                    <span className="text-slate-900 font-semibold block">{selectedFile.name}</span>
                    <span className="text-xs text-slate-500 mt-1 block">{(selectedFile.size / 1024).toFixed(2)} KB</span>
                  </div>
                </>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-slate-400 group-hover:text-violet-500 transition-colors" />
                  <div className="text-center">
                    <span className="text-slate-500 group-hover:text-violet-600 font-medium block">Click to select file</span>
                    <span className="text-xs text-slate-400 mt-1 block">Supports CSV and TXT formats</span>
                  </div>
                </>
              )}
            </label>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={uploading || !selectedFile}
          className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white py-4 px-6 rounded-xl font-bold hover:from-violet-700 hover:to-fuchsia-700 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-2xl transform hover:-translate-y-0.5 active:translate-y-0 text-lg"
        >
          {uploading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              Analyzing...
            </span>
          ) : (
            'Upload & Analyze'
          )}
        </button>
      </div>
    </div>
  );
}
