CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS territories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code VARCHAR(100),
  level VARCHAR(50) NOT NULL DEFAULT 'LOCAL',
  parent_id UUID REFERENCES territories(id),
  geometry GEOMETRY(MultiPolygon,4326),
  area_km2 NUMERIC(14,4),
  truth_state VARCHAR(30) NOT NULL DEFAULT 'DEFINED',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_territories_geometry ON territories USING GIST (geometry);
CREATE INDEX IF NOT EXISTS idx_territories_parent ON territories(parent_id);

CREATE TABLE IF NOT EXISTS evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evidence_type VARCHAR(100) NOT NULL,
  title TEXT,
  description TEXT,
  source_uri TEXT,
  observed_at TIMESTAMPTZ,
  received_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  hash_sha256 VARCHAR(64),
  truth_state VARCHAR(30) NOT NULL DEFAULT 'DECLARED',
  confidence NUMERIC(5,4),
  validation_status VARCHAR(40) NOT NULL DEFAULT 'PENDING',
  version INTEGER NOT NULL DEFAULT 1,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_evidence_truth_state ON evidence(truth_state);
CREATE INDEX IF NOT EXISTS idx_evidence_hash ON evidence(hash_sha256);

CREATE TABLE IF NOT EXISTS provenance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evidence_id UUID NOT NULL REFERENCES evidence(id) ON DELETE CASCADE,
  parent_evidence_id UUID REFERENCES evidence(id),
  operation VARCHAR(100) NOT NULL,
  algorithm VARCHAR(100),
  algorithm_version VARCHAR(50),
  actor_type VARCHAR(50),
  actor_id UUID,
  parameters JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_provenance_evidence ON provenance_records(evidence_id);

CREATE TABLE IF NOT EXISTS audit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100),
  entity_id UUID,
  before_data JSONB,
  after_data JSONB,
  request_id VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_events(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_events(created_at);

CREATE TABLE IF NOT EXISTS risk_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(100) UNIQUE NOT NULL,
  name TEXT NOT NULL,
  version VARCHAR(50) NOT NULL,
  description TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS risk_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id UUID REFERENCES risk_models(id),
  territory_id UUID REFERENCES territories(id),
  calculated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  score NUMERIC(10,4),
  level VARCHAR(50),
  confidence NUMERIC(5,4),
  inputs JSONB NOT NULL DEFAULT '{}'::jsonb,
  output JSONB NOT NULL DEFAULT '{}'::jsonb
);
CREATE INDEX IF NOT EXISTS idx_risk_assessments_territory ON risk_assessments(territory_id);
CREATE INDEX IF NOT EXISTS idx_risk_assessments_score ON risk_assessments(score DESC);

CREATE TABLE IF NOT EXISTS domain_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type VARCHAR(150) NOT NULL,
  aggregate_type VARCHAR(100),
  aggregate_id UUID,
  payload JSONB NOT NULL,
  processed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_domain_events_processed ON domain_events(processed);
CREATE INDEX IF NOT EXISTS idx_domain_events_type ON domain_events(event_type);

CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_type VARCHAR(100) NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'QUEUED',
  priority INTEGER NOT NULL DEFAULT 100,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  result JSONB,
  error TEXT,
  attempts INTEGER NOT NULL DEFAULT 0,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_jobs_status_priority ON jobs(status, priority DESC);
