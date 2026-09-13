import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const territoryVerified = body.territoryVerified === true;
  const evidenceVerified = body.evidenceVerified === true;
  const available = territoryVerified && evidenceVerified;

  return NextResponse.json({
    module: 'M03',
    gate: 'RISK_CALCULATION',
    status: available ? 'READY' : 'HOLD',
    requirements: { territoryVerified, evidenceVerified },
  }, { status: available ? 200 : 409 });
}
