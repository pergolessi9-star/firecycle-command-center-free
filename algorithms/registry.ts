export interface AlgorithmDefinition<I = unknown, O = unknown> {
  id: string;
  name: string;
  version: string;
  description: string;
  execute(input: I): Promise<O> | O;
}

export const ALGORITHM_IDS = [
  'A01_NDVI',
  'A02_NDMI',
  'A03_NBR',
  'A04_DNBR',
  'A05_BURNED_AREA',
  'A06_CHANGE_DETECTION',
  'A07_DROUGHT',
  'A08_HEAT_RISK',
  'A09_FIRE_RISK',
  'A10_FIRE_SPREAD',
  'A11_DAMAGE',
  'A12_EXPOSURE',
  'A13_ECONOMIC_IMPACT',
  'A14_ANOMALY',
  'A15_DATA_QUALITY',
  'A16_EVIDENCE_CONSISTENCY',
  'A17_SCENARIO',
] as const;

export type AlgorithmId = (typeof ALGORITHM_IDS)[number];
