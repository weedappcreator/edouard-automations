import { NextRequest, NextResponse } from "next/server";

// TODO: Add rate limiting (e.g. upstash/ratelimit) before production use.
// TODO: Connect to CRM (HubSpot, Airtable, etc.) instead of console logging.

type AuditPayload = {
  name: string;
  company: string;
  role: string;
  email: string;
  whatsapp: string;
  industry: string;
  teamSize: string;
  currentTools: string;
  primaryBottleneck: string;
  leadVolume: string;
  budget: string;
  desiredOutcome: string;
  timeline: string;
  consent: boolean;
};

function isAuditPayload(body: unknown): body is AuditPayload {
  if (typeof body !== "object" || body === null) return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.name === "string" &&
    typeof b.email === "string" &&
    typeof b.company === "string" &&
    typeof b.consent === "boolean"
  );
}

export async function POST(req: NextRequest) {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!isAuditPayload(body)) {
    return NextResponse.json(
      { error: "Missing required fields: name, email, company, consent." },
      { status: 400 }
    );
  }

  const payload = body;

  if (!payload.name.trim() || !payload.email.trim() || !payload.company.trim()) {
    return NextResponse.json(
      { error: "Name, email, and company are required." },
      { status: 400 }
    );
  }

  if (!payload.consent) {
    return NextResponse.json(
      { error: "Consent is required to proceed." },
      { status: 400 }
    );
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(payload.email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  // Log submission (replace with CRM integration in production)
  console.log("[Audit Submission]", {
    timestamp: new Date().toISOString(),
    name: payload.name,
    company: payload.company,
    role: payload.role,
    email: payload.email,
    whatsapp: payload.whatsapp,
    industry: payload.industry,
    teamSize: payload.teamSize,
    currentTools: payload.currentTools,
    primaryBottleneck: payload.primaryBottleneck,
    leadVolume: payload.leadVolume,
    budget: payload.budget,
    desiredOutcome: payload.desiredOutcome,
    timeline: payload.timeline,
  });

  return NextResponse.json({ success: true }, { status: 200 });
}
