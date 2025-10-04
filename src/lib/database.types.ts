export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      datasets: {
        Row: {
          id: string
          name: string
          mission_source: string
          file_url: string | null
          uploaded_at: string
          total_samples: number
          processed: boolean
          user_id: string
        }
        Insert: {
          id?: string
          name: string
          mission_source: string
          file_url?: string | null
          uploaded_at?: string
          total_samples?: number
          processed?: boolean
          user_id: string
        }
        Update: {
          id?: string
          name?: string
          mission_source?: string
          file_url?: string | null
          uploaded_at?: string
          total_samples?: number
          processed?: boolean
          user_id?: string
        }
      }
      exoplanet_candidates: {
        Row: {
          id: string
          dataset_id: string
          candidate_name: string
          confidence_score: number
          classification: 'exoplanet' | 'false_positive'
          detection_method: string
          orbital_period: number | null
          planet_radius: number | null
          stellar_magnitude: number | null
          features: Json
          detected_at: string
          user_id: string
        }
        Insert: {
          id?: string
          dataset_id: string
          candidate_name: string
          confidence_score: number
          classification: 'exoplanet' | 'false_positive'
          detection_method?: string
          orbital_period?: number | null
          planet_radius?: number | null
          stellar_magnitude?: number | null
          features?: Json
          detected_at?: string
          user_id: string
        }
        Update: {
          id?: string
          dataset_id?: string
          candidate_name?: string
          confidence_score?: number
          classification?: 'exoplanet' | 'false_positive'
          detection_method?: string
          orbital_period?: number | null
          planet_radius?: number | null
          stellar_magnitude?: number | null
          features?: Json
          detected_at?: string
          user_id?: string
        }
      }
      model_runs: {
        Row: {
          id: string
          dataset_id: string
          model_version: string
          accuracy: number | null
          precision_score: number | null
          recall_score: number | null
          f1_score: number | null
          total_predictions: number
          exoplanet_count: number
          false_positive_count: number
          execution_time: number
          started_at: string
          completed_at: string | null
          user_id: string
        }
        Insert: {
          id?: string
          dataset_id: string
          model_version?: string
          accuracy?: number | null
          precision_score?: number | null
          recall_score?: number | null
          f1_score?: number | null
          total_predictions?: number
          exoplanet_count?: number
          false_positive_count?: number
          execution_time?: number
          started_at?: string
          completed_at?: string | null
          user_id: string
        }
        Update: {
          id?: string
          dataset_id?: string
          model_version?: string
          accuracy?: number | null
          precision_score?: number | null
          recall_score?: number | null
          f1_score?: number | null
          total_predictions?: number
          exoplanet_count?: number
          false_positive_count?: number
          execution_time?: number
          started_at?: string
          completed_at?: string | null
          user_id?: string
        }
      }
    }
  }
}
