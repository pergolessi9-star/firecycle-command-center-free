INSERT INTO projects (slug, name, description, status)
VALUES ('project-forge', 'PROJECT FORGE', 'FIRECYCLE operational discovery and decision platform', 'ACTIVE')
ON CONFLICT (slug) DO UPDATE SET updated_at = now();

INSERT INTO audit_events (project_id, event_type, actor, payload)
SELECT id, 'FOUNDATION_SEED', 'system', jsonb_build_object('version','001_foundation','source','canonical-seed')
FROM projects WHERE slug = 'project-forge'
AND NOT EXISTS (
  SELECT 1 FROM audit_events a WHERE a.event_type='FOUNDATION_SEED' AND a.project_id=projects.id
);
