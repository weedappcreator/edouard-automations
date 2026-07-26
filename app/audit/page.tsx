"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";

type FormData = {
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

const INITIAL: FormData = {
  name: "",
  company: "",
  role: "",
  email: "",
  whatsapp: "",
  industry: "",
  teamSize: "",
  currentTools: "",
  primaryBottleneck: "",
  leadVolume: "",
  budget: "",
  desiredOutcome: "",
  timeline: "",
  consent: false,
};

const TOTAL_STEPS = 4;

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "var(--graphite)",
  border: "1px solid var(--line)",
  borderRadius: "10px",
  padding: "0.875rem 1rem",
  color: "var(--cloud)",
  fontSize: "0.9rem",
  fontFamily: "var(--font-sans)",
  outline: "none",
  transition: "border-color 0.2s",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--font-mono)",
  fontSize: "0.62rem",
  letterSpacing: "0.12em",
  color: "var(--muted)",
  marginBottom: "0.5rem",
  textTransform: "uppercase",
};

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

export default function AuditPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (field: keyof FormData, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const next = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  const prev = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    if (!form.consent) {
      setError("Please confirm your consent to continue.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await res.json()) as { success?: boolean; error?: string };
      if (data.success) {
        setSubmitted(true);
      } else {
        setError(data.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const focusStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = "rgba(200,255,74,0.5)";
  };
  const blurStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = "var(--line)";
  };

  if (submitted) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          background: "var(--ink)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            textAlign: "center",
            maxWidth: 500,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "var(--signal-soft)",
              border: "2px solid var(--signal)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.5rem",
            }}
          >
            <Check size={28} color="var(--signal)" />
          </div>
          <h1
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              marginBottom: "1rem",
            }}
          >
            Audit request received.
          </h1>
          <p style={{ color: "var(--silver)", lineHeight: 1.7, marginBottom: "2rem" }}>
            We&apos;ll review your submission and get back to you within 24 hours with a
            scoped recommendation tailored to your situation.
          </p>
          <a
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "var(--signal)",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "0.9rem",
            }}
          >
            Back to home
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--ink)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "4rem 1.5rem",
      }}
    >
      {/* Header */}
      <div style={{ width: "100%", maxWidth: 580, marginBottom: "3rem" }}>
        <a
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "var(--muted)",
            textDecoration: "none",
            fontSize: "0.825rem",
            marginBottom: "2rem",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--silver)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
        >
          <ArrowLeft size={14} />
          Edouard Automations
        </a>

        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.62rem",
            letterSpacing: "0.14em",
            color: "var(--signal)",
            display: "block",
            marginBottom: "0.75rem",
          }}
        >
          GROWTH SYSTEMS AUDIT
        </span>
        <h1
          style={{
            fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
            fontWeight: 700,
            letterSpacing: "-0.025em",
            lineHeight: 1.1,
            marginBottom: "0.75rem",
          }}
        >
          Tell us about your business.
        </h1>
        <p style={{ color: "var(--silver)", fontSize: "0.9rem", lineHeight: 1.65 }}>
          This helps us understand your situation and prepare a scoped recommendation.
          Takes about 4 minutes.
        </p>
      </div>

      {/* Progress bar */}
      <div style={{ width: "100%", maxWidth: 580, marginBottom: "2.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <span
              key={i}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.6rem",
                letterSpacing: "0.1em",
                color: step > i ? "var(--signal)" : "var(--muted)",
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
          ))}
        </div>
        <div style={{ height: 2, background: "var(--line)", borderRadius: 1 }}>
          <motion.div
            style={{ height: "100%", background: "var(--signal)", borderRadius: 1 }}
            animate={{ width: `${((step - 1) / (TOTAL_STEPS - 1)) * 100}%` }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>

      {/* Form card */}
      <div
        style={{
          width: "100%",
          maxWidth: 580,
          background: "var(--graphite)",
          border: "1px solid var(--line)",
          borderRadius: "20px",
          padding: "2.5rem",
          minHeight: 340,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {step === 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.25rem" }}>
                  Your contact information
                </h2>
                <Field label="Full name *">
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="Edouard Kerwing"
                    style={inputStyle}
                    onFocus={focusStyle}
                    onBlur={blurStyle}
                    required
                  />
                </Field>
                <Field label="Company *">
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) => update("company", e.target.value)}
                    placeholder="Acme Corp"
                    style={inputStyle}
                    onFocus={focusStyle}
                    onBlur={blurStyle}
                    required
                  />
                </Field>
                <Field label="Your role">
                  <input
                    type="text"
                    value={form.role}
                    onChange={(e) => update("role", e.target.value)}
                    placeholder="Founder, Head of Operations, etc."
                    style={inputStyle}
                    onFocus={focusStyle}
                    onBlur={blurStyle}
                  />
                </Field>
                <Field label="Email *">
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="you@company.com"
                    style={inputStyle}
                    onFocus={focusStyle}
                    onBlur={blurStyle}
                    required
                  />
                </Field>
                <Field label="WhatsApp number">
                  <input
                    type="tel"
                    value={form.whatsapp}
                    onChange={(e) => update("whatsapp", e.target.value)}
                    placeholder="+1 809 000 0000"
                    style={inputStyle}
                    onFocus={focusStyle}
                    onBlur={blurStyle}
                  />
                </Field>
              </div>
            )}

            {step === 2 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.25rem" }}>
                  About your business
                </h2>
                <Field label="Industry *">
                  <select
                    value={form.industry}
                    onChange={(e) => update("industry", e.target.value)}
                    style={{ ...inputStyle, appearance: "none" }}
                    onFocus={focusStyle}
                    onBlur={blurStyle}
                  >
                    <option value="">Select industry</option>
                    <option>Real Estate & Construction</option>
                    <option>Food & Hospitality</option>
                    <option>Professional Services</option>
                    <option>Healthcare</option>
                    <option>E-commerce & Retail</option>
                    <option>Education</option>
                    <option>Technology</option>
                    <option>Finance & Insurance</option>
                    <option>Other</option>
                  </select>
                </Field>
                <Field label="Team size">
                  <select
                    value={form.teamSize}
                    onChange={(e) => update("teamSize", e.target.value)}
                    style={{ ...inputStyle, appearance: "none" }}
                    onFocus={focusStyle}
                    onBlur={blurStyle}
                  >
                    <option value="">Select team size</option>
                    <option>Solo / 1 person</option>
                    <option>2–5 people</option>
                    <option>6–15 people</option>
                    <option>16–50 people</option>
                    <option>50+ people</option>
                  </select>
                </Field>
                <Field label="Current tools and systems (CRM, email, chat, etc.)">
                  <textarea
                    value={form.currentTools}
                    onChange={(e) => update("currentTools", e.target.value)}
                    placeholder="WhatsApp, Excel, HubSpot, Gmail..."
                    rows={4}
                    style={{ ...inputStyle, resize: "vertical" }}
                    onFocus={focusStyle}
                    onBlur={blurStyle}
                  />
                </Field>
              </div>
            )}

            {step === 3 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.25rem" }}>
                  Your current challenges
                </h2>
                <Field label="Primary bottleneck or pain point *">
                  <textarea
                    value={form.primaryBottleneck}
                    onChange={(e) => update("primaryBottleneck", e.target.value)}
                    placeholder="Where does your team spend the most manual time? Where do leads or deals get lost?"
                    rows={4}
                    style={{ ...inputStyle, resize: "vertical" }}
                    onFocus={focusStyle}
                    onBlur={blurStyle}
                    required
                  />
                </Field>
                <Field label="Monthly lead or inquiry volume">
                  <select
                    value={form.leadVolume}
                    onChange={(e) => update("leadVolume", e.target.value)}
                    style={{ ...inputStyle, appearance: "none" }}
                    onFocus={focusStyle}
                    onBlur={blurStyle}
                  >
                    <option value="">Select volume</option>
                    <option>Less than 20</option>
                    <option>20–50</option>
                    <option>50–150</option>
                    <option>150–500</option>
                    <option>500+</option>
                  </select>
                </Field>
                <Field label="Approximate budget range (RD$)">
                  <select
                    value={form.budget}
                    onChange={(e) => update("budget", e.target.value)}
                    style={{ ...inputStyle, appearance: "none" }}
                    onFocus={focusStyle}
                    onBlur={blurStyle}
                  >
                    <option value="">Select range</option>
                    <option>Under RD$25,000</option>
                    <option>RD$25,000 – RD$60,000</option>
                    <option>RD$60,000 – RD$120,000</option>
                    <option>RD$120,000 – RD$300,000</option>
                    <option>RD$300,000+</option>
                    <option>Not sure yet</option>
                  </select>
                </Field>
              </div>
            )}

            {step === 4 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.25rem" }}>
                  Goals and confirmation
                </h2>
                <Field label="Desired outcome *">
                  <textarea
                    value={form.desiredOutcome}
                    onChange={(e) => update("desiredOutcome", e.target.value)}
                    placeholder="What does success look like 6 months from now? What specific results matter most?"
                    rows={4}
                    style={{ ...inputStyle, resize: "vertical" }}
                    onFocus={focusStyle}
                    onBlur={blurStyle}
                    required
                  />
                </Field>
                <Field label="Desired timeline">
                  <select
                    value={form.timeline}
                    onChange={(e) => update("timeline", e.target.value)}
                    style={{ ...inputStyle, appearance: "none" }}
                    onFocus={focusStyle}
                    onBlur={blurStyle}
                  >
                    <option value="">Select timeline</option>
                    <option>As soon as possible</option>
                    <option>Within 1 month</option>
                    <option>1–3 months</option>
                    <option>3–6 months</option>
                    <option>Just exploring for now</option>
                  </select>
                </Field>

                {/* Consent */}
                <label
                  style={{
                    display: "flex",
                    gap: "0.75rem",
                    alignItems: "flex-start",
                    cursor: "pointer",
                    padding: "1rem",
                    background: "var(--elevated)",
                    borderRadius: "10px",
                    border: "1px solid var(--line)",
                  }}
                >
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: "4px",
                      border: form.consent ? "none" : "1.5px solid var(--line)",
                      background: form.consent ? "var(--signal)" : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      marginTop: 2,
                      transition: "background 0.2s",
                    }}
                    onClick={() => update("consent", !form.consent)}
                  >
                    {form.consent && <Check size={11} color="var(--ink)" strokeWidth={3} />}
                  </div>
                  <input
                    type="checkbox"
                    checked={form.consent}
                    onChange={(e) => update("consent", e.target.checked)}
                    style={{ display: "none" }}
                  />
                  <span style={{ color: "var(--silver)", fontSize: "0.825rem", lineHeight: 1.6 }}>
                    I confirm that the information provided is accurate and I agree to be
                    contacted by Edouard Automations to discuss my project. I understand this
                    is not a binding commitment.
                  </span>
                </label>

                {error && (
                  <p style={{ color: "#FF6B6B", fontSize: "0.825rem" }}>{error}</p>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div
        style={{
          width: "100%",
          maxWidth: 580,
          display: "flex",
          justifyContent: "space-between",
          marginTop: "1.5rem",
        }}
      >
        <button
          onClick={prev}
          disabled={step === 1}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "none",
            border: "1px solid var(--line)",
            color: step === 1 ? "var(--muted)" : "var(--silver)",
            padding: "0.75rem 1.5rem",
            borderRadius: "10px",
            cursor: step === 1 ? "default" : "pointer",
            fontSize: "0.875rem",
            fontFamily: "var(--font-sans)",
            opacity: step === 1 ? 0.4 : 1,
            transition: "opacity 0.2s",
          }}
        >
          <ArrowLeft size={15} />
          Back
        </button>

        {step < TOTAL_STEPS ? (
          <button
            onClick={next}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "var(--signal)",
              border: "none",
              color: "var(--ink)",
              padding: "0.75rem 1.75rem",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "0.875rem",
              fontWeight: 700,
              fontFamily: "var(--font-sans)",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Continue
            <ArrowRight size={15} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "var(--signal)",
              border: "none",
              color: "var(--ink)",
              padding: "0.75rem 1.75rem",
              borderRadius: "10px",
              cursor: loading ? "wait" : "pointer",
              fontSize: "0.875rem",
              fontWeight: 700,
              fontFamily: "var(--font-sans)",
              opacity: loading ? 0.7 : 1,
              transition: "opacity 0.2s",
            }}
          >
            {loading ? "Submitting..." : "Submit Audit Request"}
            {!loading && <ArrowRight size={15} />}
          </button>
        )}
      </div>
    </div>
  );
}
