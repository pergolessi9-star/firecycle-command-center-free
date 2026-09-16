CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS schema_migrations (
  version text PRIMARY KEY,
  applied_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'ACTIVE',
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS discovery_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'QUEUED' CHECK (status IN ('QUEUED','RUNNING','COMPLETED','FAILED','CANCELLED')),
  input jsonb NOT NULL DEFAULT '{}'::jsonb,
  output jsonb,
  error_message text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS agent_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  discovery_run_id uuid NOT NULL REFERENCES discovery_runs(id) ON DELETE CASCADE,
  agent_key text NOT NULL,
  status text NOT NULL DEFAULT 'QUEUED' CHECK (status IN ('QUEUED','RUNNING','COMPLETED','FAILED','CANCELLED')),
  input jsonb NOT NULL DEFAULT '{}'::jsonb,
  output jsonb,
  sources jsonb NOT NULL DEFAULT '[]'::jsonb,
  confidence numeric(5,4),
  tokens integer,
  duration_ms integer,
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);

CREATE TABLE IF NOT EXISTS sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  discovery_run_id uuid REFERENCES discovery_runs(id) ON DELETE SET NULL,
  uri text NOT NULL,
  title text,
  source_type text NOT NULL DEFAULT 'WEB',
  content_hash text,
  provenance jsonb NOT NULL DEFAULT '{}'::jsonb,
  retrieved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS evidence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  source_id uuid REFERENCES sources(id) ON DELETE SET NULL,
  truth_state text NOT NULL DEFAULT 'OBSERVED',
  statement text NOT NULL,
  sha256 text,
  verified_by text,
  verified_at timestamptz,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS findings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  discovery_run_id uuid REFERENCES discovery_runs(id) ON DELETE CASCADE,
  severity text NOT NULL DEFAULT 'INFO',
  title text NOT NULL,
  description text,
  evidence_ids uuid[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'OPEN',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS synthesis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  discovery_run_id uuid NOT NULL UNIQUE REFERENCES discovery_runs(id) ON DELETE CASCADE,
  summary text,
  result jsonb NOT NULL DEFAULT '{}'::jsonb,
  confidence numeric(5,4),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS audit_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  discovery_run_id uuid REFERENCES discovery_runs(id) ON DELETE SET NULL,
  event_type text NOT NULL,
  actor text NOT NULL DEFAULT 'system',
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_discovery_runs_project ON discovery_runs(project_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_agent_runs_discovery ON agent_runs(discovery_run_id, created_at);
CREATE INDEX IF NOT EXISTS idx_sources_run ON sources(discovery_run_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_evidence_project ON evidence(project_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_findings_run ON findings(discovery_run_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_events_run ON audit_events(discovery_run_id, created_at DESC);
