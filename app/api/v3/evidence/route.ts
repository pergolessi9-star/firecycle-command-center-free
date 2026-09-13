import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    module: 'M02',
    status: 'FOUNDATION',
    endpoint: '/api/v3/evidence',
    truthStates: ['DECLARED', 'OBSERVED', 'CALCULATED', 'ESTIMATED', 'DEFINED', 'HOLD', 'NOT_AVAILABLE', 'VERIFIED'],
  });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.evidenceType !== 'string') {
    return NextResponse.json({ error: 'evidenceType is required' }, { status: 400 });
  }
  return NextResponse.json({
    accepted: true,
    module: 'M02',
    truthState: 'DECLARED',
    evidence: body,
  }, { status: 202 });
}
