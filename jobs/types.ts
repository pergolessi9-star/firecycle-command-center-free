export type JobStatus = 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

export interface Job<TPayload = Record<string, unknown>> {
  id: string;
  jobType: string;
  status: JobStatus;
  priority: number;
  payload: TPayload;
  attempts: number;
}

export const JOB_TYPES = [
  'INGEST_SATELLITE',
  'PROCESS_SATELLITE',
  'CALCULATE_NDVI',
  'CALCULATE_NDMI',
  'CALCULATE_NBR',
  'DETECT_CHANGE',
  'CALCULATE_BURNED_AREA',
  'INGEST_WEATHER',
  'INGEST_CLIMATE',
  'CALCULATE_FIRE_RISK',
  'CALCULATE_DROUGHT_RISK',
  'CALCULATE_INFRASTRUCTURE_EXPOSURE',
  'RUN_AI_AGENT',
  'RUN_AI_REVIEW',
  'RUN_SCENARIO',
  'GENERATE_REPORT',
  'GENERATE_EVIDENCE_MANIFEST',
] as const;
