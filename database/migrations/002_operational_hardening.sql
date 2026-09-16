CREATE UNIQUE INDEX IF NOT EXISTS ux_audit_foundation_seed
  ON audit_events(project_id, event_type)
  WHERE event_type = 'FOUNDATION_SEED';

CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_agent_runs_status ON agent_runs(status, created_at DESC);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'vector') THEN
    RAISE EXCEPTION 'pgvector extension is required by PROJECT FORGE production foundation';
  END IF;
END $$;
