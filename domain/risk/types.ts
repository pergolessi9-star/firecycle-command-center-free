import type { TruthState } from '../../core/truth';

export interface RiskAssessment {
  id: string;
  territoryId: string;
  modelCode: string;
  modelVersion: string;
  score: number;
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  confidence: number;
  truthState: TruthState;
  inputs: Record<string, unknown>;
  output: Record<string, unknown>;
}

export interface RiskGateInput {
  territoryVerified: boolean;
  evidenceVerified: boolean;
}
