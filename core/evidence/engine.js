const crypto = require('crypto');

function sha256(value) {
  return crypto.createHash('sha256').update(String(value), 'utf8').digest('hex');
}

function extractEvidence(text) {
  return String(text || '')
    .split(/\n+/)
    .map(x => x.trim())
    .filter(Boolean)
    .filter(x => x.length >= 30)
    .slice(0, 12)
    .map(statement => ({ statement, truth_state: 'OBSERVED', sha256: sha256(statement) }));
}

function buildFindings(agentKey, text) {
  return String(text || '').split(/\n+/).map(x => x.trim()).filter(Boolean).slice(0, 6).map((description, i) => ({
    severity: 'INFO',
    title: `${agentKey} observation ${i + 1}`,
    description
  }));
}

module.exports = { sha256, extractEvidence, buildFindings };
