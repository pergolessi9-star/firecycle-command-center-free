export const TRUTH_STATES = [
  'DECLARED',
  'OBSERVED',
  'CALCULATED',
  'ESTIMATED',
  'DEFINED',
  'HOLD',
  'NOT_AVAILABLE',
  'VERIFIED',
] as const;

export type TruthState = (typeof TRUTH_STATES)[number];

export function canPromoteToVerified(state: TruthState, evidenceVerified: boolean): boolean {
  return state !== 'VERIFIED' && evidenceVerified;
}

export function isBlocked(state: TruthState): boolean {
  return state === 'HOLD' || state === 'NOT_AVAILABLE';
}
