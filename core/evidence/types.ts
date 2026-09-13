import type { TruthState } from '../truth';

export interface EvidenceRecord {
  id: string;
  evidenceType: string;
  title?: string;
  sourceUri?: string;
  observedAt?: string;
  hashSha256?: string;
  truthState: TruthState;
  confidence?: number;
  validationStatus: 'PENDING' | 'VALID' | 'INVALID' | 'REVIEW';
  metadata: Record<string, unknown>;
}

export interface ProvenanceRecord {
  id: string;
  evidenceId: string;
  parentEvidenceId?: string;
  operation: string;
  algorithm?: string;
  algorithmVersion?: string;
  parameters: Record<string, unknown>;
}
