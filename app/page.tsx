"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useInView,
  AnimatePresence,
} from "motion/react";
import { ReactLenis, useLenis } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ArrowUpRight, Menu, X, ChevronRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// ─── Animation primitives ──────────────────────────────────────────────────

function WordReveal({
  text,
  className = "",
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduce = useReducedMotion();
  const words = text.split(" ");

  return (
    <span ref={ref} className={className} aria-label={text}>
      {words.map((word, i) => (
        <span
          key={i}
          style={{ display: "inline-block", overflow: "hidden", marginRight: "0.28em" }}
        >
          <motion.span
            style={{ display: "inline-block" }}
            initial={reduce ? {} : { y: "110%", opacity: 0 }}
            animate={
              isInView || reduce
                ? { y: "0%", opacity: 1 }
                : { y: "110%", opacity: 0 }
            }
            transition={{
              duration: 0.65,
              delay: delay + i * 0.055,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

function Up({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-8% 0px" });
  const reduce = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduce ? {} : { opacity: 0, y: 28 }}
      animate={isInView || reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Line({ delay = 0 }: { delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const reduce = useReducedMotion();

  return (
    <div ref={ref} style={{ overflow: "hidden", height: "1px", background: "var(--line)" }}>
      <motion.div
        style={{ height: "100%", background: "var(--line)", transformOrigin: "left" }}
        initial={reduce ? {} : { scaleX: 0 }}
        animate={isInView || reduce ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}

function useMagnet(strength = 0.3) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const reduce = useReducedMotion();

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (reduce) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      x.set((e.clientX - cx) * strength);
      y.set((e.clientY - cy) * strength);
    },
    [x, y, strength, reduce]
  );

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return { x, y, handleMouseMove, handleMouseLeave };
}

// ─── Lenis + GSAP sync ─────────────────────────────────────────────────────

function LenisGSAPSync() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);
    const ticker = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);
    return () => {
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(ticker);
    };
  }, [lenis]);

  return null;
}

// ─── Progress bar ──────────────────────────────────────────────────────────

function ProgressBar() {
  const { scrollYProgress } = useScroll();
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[9999] h-[2px] origin-left"
      style={{ backgroundColor: "#C8FF4A", scaleX: scrollYProgress }}
    />
  );
}

// ─── Announcement rail ─────────────────────────────────────────────────────

function AnnouncementRail() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  const text = "NOW ACCEPTING 3 GROWTH SYSTEM PROJECTS FOR Q3";
  const items = Array(8).fill(text);

  return (
    <div
      style={{
        background: "var(--carbon)",
        borderBottom: "1px solid var(--line)",
        height: 36,
        overflow: "hidden",
        position: "relative",
        zIndex: 50,
      }}
    >
      <div className="flex items-center h-full">
        <div className="flex-1 overflow-hidden relative">
          <div className="marquee-track flex items-center gap-0 whitespace-nowrap">
            {items.concat(items).map((item, i) => (
              <span
                key={i}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.6rem",
                  letterSpacing: "0.12em",
                  color: "var(--muted)",
                  flexShrink: 0,
                  paddingRight: "2.5rem",
                }}
              >
                {item}
                <span style={{ color: "var(--signal)", marginLeft: "1.25rem" }}>·</span>
              </span>
            ))}
          </div>
        </div>
        <button
          onClick={() => setVisible(false)}
          aria-label="Dismiss announcement"
          style={{
            flexShrink: 0,
            padding: "0 12px",
            color: "var(--muted)",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          <X size={12} />
        </button>
      </div>
    </div>
  );
}

// ─── Nav ───────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { label: "Services", href: "#services" },
  { label: "Systems", href: "#growth-os" },
  { label: "Work", href: "#work" },
  { label: "Process", href: "#process" },
  { label: "About", href: "#about" },
];

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = NAV_ITEMS.map((item) =>
      document.querySelector(item.href)
    ).filter(Boolean) as Element[];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          transition: "background 0.4s ease, backdrop-filter 0.4s ease, border-color 0.4s ease",
          background: scrolled ? "rgba(14,18,23,0.85)" : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled ? "1px solid var(--line)" : "1px solid transparent",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 2rem",
            height: 68,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <a
            href="/"
            style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "10px",
                background: "var(--signal)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-mono)",
                fontWeight: 700,
                fontSize: "0.8rem",
                color: "var(--ink)",
                letterSpacing: "-0.02em",
              }}
            >
              EA
            </div>
            <span
              style={{
                fontWeight: 600,
                fontSize: "0.9rem",
                color: "var(--cloud)",
                letterSpacing: "-0.01em",
              }}
            >
              Edouard Automations
            </span>
          </a>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color:
                    activeSection === item.href.slice(1)
                      ? "var(--cloud)"
                      : "var(--silver)",
                  transition: "color 0.2s",
                  padding: "0.25rem 0",
                  borderBottom:
                    activeSection === item.href.slice(1)
                      ? "1px solid var(--signal)"
                      : "1px solid transparent",
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="/audit"
              style={{
                background: "var(--signal)",
                color: "var(--ink)",
                padding: "0.5rem 1.25rem",
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "0.875rem",
                textDecoration: "none",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Book an Audit
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--cloud)",
              padding: "0.5rem",
            }}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 90,
              background: "rgba(7,9,12,0.97)",
              backdropFilter: "blur(20px)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "2rem",
            }}
          >
            <button
              onClick={() => setMobileOpen(false)}
              style={{
                position: "absolute",
                top: "1.25rem",
                right: "1.5rem",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--silver)",
              }}
            >
              <X size={24} />
            </button>
            {NAV_ITEMS.map((item, i) => (
              <motion.button
                key={item.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                onClick={() => handleNavClick(item.href)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "clamp(1.75rem, 6vw, 2.5rem)",
                  fontWeight: 600,
                  color: "var(--cloud)",
                  fontFamily: "var(--font-sans)",
                  letterSpacing: "-0.02em",
                }}
              >
                {item.label}
              </motion.button>
            ))}
            <motion.a
              href="/audit"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              style={{
                background: "var(--signal)",
                color: "var(--ink)",
                padding: "0.75rem 2rem",
                borderRadius: "10px",
                fontWeight: 700,
                fontSize: "1rem",
                textDecoration: "none",
                marginTop: "1rem",
              }}
            >
              Book an Audit
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Hero section ──────────────────────────────────────────────────────────

function HeroNetwork() {
  const svgRef = useRef<SVGSVGElement>(null);
  const reduce = useReducedMotion();

  const nodes = [
    { id: "lead", x: 60, y: 50, label: "Lead captured" },
    { id: "qualified", x: 240, y: 130, label: "Qualified" },
    { id: "assigned", x: 420, y: 60, label: "Assigned" },
    { id: "contacted", x: 560, y: 160, label: "Contacted" },
    { id: "booked", x: 380, y: 270, label: "Booked" },
    { id: "followed", x: 180, y: 300, label: "Followed up" },
    { id: "measured", x: 500, y: 370, label: "Measured" },
  ];

  const edges = [
    { from: 0, to: 1 },
    { from: 1, to: 2 },
    { from: 2, to: 3 },
    { from: 3, to: 4 },
    { from: 4, to: 5 },
    { from: 4, to: 6 },
    { from: 1, to: 5 },
  ];

  useEffect(() => {
    if (reduce || !svgRef.current) return;
    const lines = svgRef.current.querySelectorAll(".edge-line");
    gsap.set(lines, { strokeDashoffset: 200 });
    gsap.to(lines, {
      strokeDashoffset: 0,
      duration: 0.6,
      stagger: 0.12,
      delay: 1.2,
      ease: "power2.out",
    });
  }, [reduce]);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 620 430"
      style={{ width: "100%", height: "100%", maxHeight: 430 }}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#C8FF4A" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#C8FF4A" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Edges */}
      {edges.map((edge, i) => {
        const from = nodes[edge.from];
        const to = nodes[edge.to];
        return (
          <line
            key={i}
            className="edge-line"
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke="#2C3541"
            strokeWidth="1.5"
            strokeDasharray="200"
            strokeDashoffset={reduce ? 0 : 200}
          />
        );
      })}

      {/* Nodes */}
      {nodes.map((node, i) => (
        <g key={node.id}>
          <circle cx={node.x} cy={node.y} r={22} fill="url(#glow)" />
          <circle
            cx={node.x}
            cy={node.y}
            r={14}
            fill="var(--graphite)"
            stroke={i === 0 ? "#C8FF4A" : "#2C3541"}
            strokeWidth={i === 0 ? 2 : 1.5}
            style={
              reduce
                ? {}
                : {
                    animation: `pulse-signal ${2 + i * 0.4}s ease-in-out infinite`,
                    animationDelay: `${i * 0.3}s`,
                  }
            }
          />
          <circle cx={node.x} cy={node.y} r={4} fill={i === 0 ? "#C8FF4A" : "#7B8794"} />
          <text
            x={node.x}
            y={node.y + 30}
            textAnchor="middle"
            fill="#7B8794"
            fontSize="10"
            fontFamily="var(--font-mono)"
          >
            {node.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

function Hero() {
  const reduce = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (reduce) return;
      const rect = e.currentTarget.getBoundingClientRect();
      mouseX.set(((e.clientX - rect.left) / rect.width - 0.5) * 16);
      mouseY.set(((e.clientY - rect.top) / rect.height - 0.5) * 16);
    },
    [mouseX, mouseY, reduce]
  );

  const integrations = [
    "n8n", "Make", "OpenAI", "Claude", "Gemini",
    "HubSpot", "Airtable", "WhatsApp", "Vapi", "Calendly",
  ];

  return (
    <section
      id="hero"
      onMouseMove={handleMouseMove}
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "calc(68px + 4rem) 2rem 4rem",
        maxWidth: 1280,
        margin: "0 auto",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "4rem",
          alignItems: "center",
        }}
        className="hero-grid"
      >
        {/* Left content */}
        <div>
          <motion.span
            className="eyebrow"
            initial={reduce ? {} : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            AI GROWTH PARTNER · AUTOMATION · CRM · WEB
          </motion.span>

          <h1
            style={{
              fontSize: "var(--font-h1)",
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
              marginBottom: "1.5rem",
              color: "var(--cloud)",
            }}
          >
            <WordReveal
              text="Build a business that grows without adding more manual work."
              delay={0.45}
            />
          </h1>

          <Up delay={0.7}>
            <p
              style={{
                fontSize: "var(--font-body-lg)",
                color: "var(--silver)",
                lineHeight: 1.7,
                marginBottom: "1rem",
              }}
            >
              We connect AI, automation, CRM, marketing and high-converting web
              experiences into one operating system designed to scale.
            </p>
            <p
              style={{
                fontSize: "0.875rem",
                color: "var(--muted)",
                lineHeight: 1.6,
                marginBottom: "2.5rem",
                paddingLeft: "1rem",
                borderLeft: "2px solid var(--signal)",
              }}
            >
              Target up to 50% less manual workload in qualified processes after
              a structured operations audit.
            </p>
          </Up>

          <Up delay={0.85}>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <a
                href="/audit"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "var(--signal)",
                  color: "var(--ink)",
                  padding: "0.875rem 1.75rem",
                  borderRadius: "10px",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  textDecoration: "none",
                  transition: "opacity 0.2s, transform 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "0.88";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "1";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                Book a Growth Systems Audit
                <ArrowRight size={16} />
              </a>
              <button
                onClick={() => {
                  document.querySelector("#growth-os")?.scrollIntoView({ behavior: "smooth" });
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "none",
                  border: "1px solid var(--line)",
                  color: "var(--silver)",
                  padding: "0.875rem 1.75rem",
                  borderRadius: "10px",
                  fontWeight: 500,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  transition: "border-color 0.2s, color 0.2s",
                  fontFamily: "var(--font-sans)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--silver)";
                  e.currentTarget.style.color = "var(--cloud)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--line)";
                  e.currentTarget.style.color = "var(--silver)";
                }}
              >
                Explore Our Systems
                <ChevronRight size={16} />
              </button>
            </div>
          </Up>
        </div>

        {/* Right: animated network */}
        <motion.div
          style={{
            x: reduce ? 0 : springX,
            y: reduce ? 0 : springY,
            padding: "2rem",
            background: "var(--graphite)",
            border: "1px solid var(--line)",
            borderRadius: "24px",
            minHeight: 360,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          initial={reduce ? {} : { opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <HeroNetwork />
        </motion.div>
      </div>

      {/* Integration logos */}
      <Up delay={1.1}>
        <div style={{ marginTop: "4rem" }}>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.65rem",
              letterSpacing: "0.12em",
              color: "var(--muted)",
              marginBottom: "1rem",
            }}
          >
            INTEGRATED WITH
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {integrations.map((name) => (
              <span
                key={name}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.7rem",
                  letterSpacing: "0.08em",
                  color: "var(--muted)",
                  padding: "0.3rem 0.75rem",
                  border: "1px solid var(--line)",
                  borderRadius: "999px",
                  background: "var(--carbon)",
                }}
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </Up>

      <style>{`
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
        }
      `}</style>
    </section>
  );
}

// ─── Problem section ───────────────────────────────────────────────────────

function ProblemSection() {
  const problems = [
    {
      num: "01",
      title: "Slow Response",
      body: "Leads go cold while teams juggle manual tasks. First contact is delayed by hours instead of seconds.",
    },
    {
      num: "02",
      title: "Manual Follow-Up",
      body: "Prospects fall through gaps when reps forget, get busy, or have no structured sequence to follow.",
    },
    {
      num: "03",
      title: "Disconnected Tools",
      body: "CRM, forms, email, WhatsApp and spreadsheets don't talk to each other. Data lives in five places.",
    },
    {
      num: "04",
      title: "Invisible Performance",
      body: "No real-time view of what's working. Decisions are based on guesses, not measurable attribution.",
    },
  ];

  return (
    <section id="problem" style={{ padding: "6rem 2rem", background: "var(--carbon)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <Up>
          <span className="eyebrow">THE PROBLEM</span>
          <h2
            style={{
              fontSize: "var(--font-h2)",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              lineHeight: 1.1,
              marginBottom: "1.5rem",
              maxWidth: 640,
            }}
          >
            Growth breaks when the operation behind it cannot keep up.
          </h2>
        </Up>
        <Line delay={0.1} />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1.25rem",
            marginTop: "3rem",
          }}
        >
          {problems.map((p, i) => (
            <Up key={p.num} delay={i * 0.1}>
              <div
                style={{
                  background: "var(--graphite)",
                  border: "1px solid var(--line)",
                  borderRadius: "20px",
                  padding: "2rem",
                  height: "100%",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.65rem",
                    letterSpacing: "0.14em",
                    color: "var(--signal)",
                    display: "block",
                    marginBottom: "1rem",
                  }}
                >
                  {p.num}
                </span>
                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 600,
                    marginBottom: "0.75rem",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {p.title}
                </h3>
                <p style={{ color: "var(--silver)", lineHeight: 1.65, fontSize: "0.9rem" }}>
                  {p.body}
                </p>
              </div>
            </Up>
          ))}
        </div>

        <Up delay={0.4}>
          <p
            style={{
              marginTop: "3rem",
              fontSize: "var(--font-body-lg)",
              color: "var(--silver)",
              borderLeft: "2px solid var(--signal)",
              paddingLeft: "1.5rem",
              maxWidth: 700,
            }}
          >
            We turn these disconnected actions into one measurable operating system.
          </p>
        </Up>
      </div>
    </section>
  );
}

// ─── Growth OS (horizontal scroll) ────────────────────────────────────────

function GrowthOSSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const stages = [
    {
      num: "01",
      label: "ATTRACT",
      body: "Content, campaigns, website and offers that bring the right people to your business.",
    },
    {
      num: "02",
      label: "CAPTURE",
      body: "Forms, WhatsApp, calls and conversational AI that never let a lead slip.",
    },
    {
      num: "03",
      label: "QUALIFY",
      body: "Validation, scoring, enrichment and routing — your team focuses only on real opportunities.",
    },
    {
      num: "04",
      label: "CONVERT",
      body: "CRM, appointments, reminders and follow-up that move prospects to action.",
    },
    {
      num: "05",
      label: "DELIVER",
      body: "Onboarding, notifications and internal workflows that make delivery consistent.",
    },
    {
      num: "06",
      label: "OPTIMIZE",
      body: "Dashboards, attribution and improvement that compound every result over time.",
    },
  ];

  useEffect(() => {
    if (reduce || !sectionRef.current || !trackRef.current) return;

    const ctx = gsap.context(() => {
      const track = trackRef.current!;
      const totalWidth = track.scrollWidth - window.innerWidth;

      gsap.to(track, {
        x: -totalWidth,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${totalWidth}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reduce]);

  // Mobile: stacked layout
  if (reduce) {
    return (
      <section id="growth-os" style={{ padding: "6rem 2rem", background: "var(--ink)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <span className="eyebrow-signal">GROWTH OPERATING SYSTEM</span>
          <h2
            style={{
              fontSize: "var(--font-h2)",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              lineHeight: 1.1,
              marginBottom: "1rem",
            }}
          >
            One connected system from attention to operation.
          </h2>
          <p style={{ color: "var(--silver)", marginBottom: "3rem" }}>
            Instead of isolated tactics, we design the complete path between discovery and delivery.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
            {stages.map((stage) => (
              <div
                key={stage.num}
                style={{
                  background: "var(--graphite)",
                  border: "1px solid var(--line)",
                  borderRadius: "20px",
                  padding: "2rem",
                }}
              >
                <span style={{ fontFamily: "var(--font-mono)", color: "var(--signal)", fontSize: "0.65rem", letterSpacing: "0.14em", display: "block", marginBottom: "0.75rem" }}>
                  {stage.num}
                </span>
                <h3 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.75rem" }}>{stage.label}</h3>
                <p style={{ color: "var(--silver)", fontSize: "0.9rem", lineHeight: 1.65 }}>{stage.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="growth-os"
      style={{ background: "var(--ink)", overflow: "hidden" }}
    >
      <div style={{ height: "100vh", display: "flex", alignItems: "center" }}>
        <div
          ref={trackRef}
          style={{ display: "flex", gap: "1.5rem", paddingLeft: "6rem", paddingRight: "6rem", willChange: "transform" }}
        >
          {/* Header card */}
          <div
            style={{
              flexShrink: 0,
              width: 420,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              paddingRight: "2rem",
            }}
          >
            <span className="eyebrow-signal">GROWTH OPERATING SYSTEM</span>
            <h2
              style={{
                fontSize: "var(--font-h2)",
                fontWeight: 700,
                letterSpacing: "-0.025em",
                lineHeight: 1.1,
                marginBottom: "1.25rem",
              }}
            >
              One connected system from attention to operation.
            </h2>
            <p style={{ color: "var(--silver)", lineHeight: 1.7 }}>
              Instead of isolated tactics, we design the complete path between discovery
              and delivery.
            </p>
          </div>

          {/* Stage cards */}
          {stages.map((stage, i) => (
            <div
              key={stage.num}
              className="os-card"
              style={{
                flexShrink: 0,
                width: 340,
                padding: "2.25rem",
                borderRadius: "24px",
                background: "var(--graphite)",
                border: "1px solid var(--line)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  marginBottom: "1.5rem",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: "var(--signal)",
                    fontSize: "0.65rem",
                    letterSpacing: "0.14em",
                  }}
                >
                  {stage.num}
                </span>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    border: `1px solid var(--signal)`,
                    opacity: i === 0 ? 1 : 0.25,
                  }}
                />
              </div>
              <h3
                style={{
                  fontSize: "2rem",
                  fontWeight: 700,
                  marginBottom: "1rem",
                  letterSpacing: "-0.02em",
                }}
              >
                {stage.label}
              </h3>
              <p style={{ color: "var(--silver)", lineHeight: 1.65, fontSize: "0.9rem" }}>
                {stage.body}
              </p>
            </div>
          ))}

          {/* Spacer */}
          <div style={{ flexShrink: 0, width: "4rem" }} />
        </div>
      </div>
    </section>
  );
}

// ─── Services section ──────────────────────────────────────────────────────

const SERVICES = [
  {
    num: "01",
    name: "AI Operations",
    outcome: "Automate repetitive administrative work, route information and create reliable operating workflows.",
    desc: "Design and implement custom automation flows that eliminate manual steps, reduce errors and free your team for high-value work.",
    flow: ["Audit", "Map", "Design", "Build", "Monitor"],
    accent: "#C8FF4A",
  },
  {
    num: "02",
    name: "AI Receptionist",
    outcome: "Respond, qualify, schedule and escalate customer conversations across approved channels.",
    desc: "Conversational AI that handles inquiries via WhatsApp, web chat and voice — 24/7, without missing a lead.",
    flow: ["Inbound", "Qualify", "Route", "Schedule", "Escalate"],
    accent: "#32D6C5",
  },
  {
    num: "03",
    name: "Revenue Automation",
    outcome: "Connect lead sources, CRM, assignments and follow-up so opportunities move without manual effort.",
    desc: "A complete revenue operations layer: lead capture to close, with automated follow-up and real-time visibility.",
    flow: ["Capture", "Score", "Assign", "Follow", "Close"],
    accent: "#6977FF",
  },
  {
    num: "04",
    name: "Growth Marketing Systems",
    outcome: "Turn content and campaigns into a structured funnel with nurturing, attribution and sales action.",
    desc: "Strategy, execution and measurement of marketing systems that generate and convert demand consistently.",
    flow: ["Attract", "Nurture", "Convert", "Retain", "Measure"],
    accent: "#C8FF4A",
  },
  {
    num: "05",
    name: "Web Experiences",
    outcome: "Build premium websites and digital products connected to CRM, automation and measurable conversion.",
    desc: "High-performance, visually refined web experiences designed from the ground up to generate trust and action.",
    flow: ["Strategy", "Design", "Build", "Connect", "Optimize"],
    accent: "#32D6C5",
  },
];

function ServicesSection() {
  return (
    <section id="services" style={{ padding: "6rem 2rem", background: "var(--ink)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <Up>
          <span className="eyebrow">SERVICES</span>
          <h2
            style={{
              fontSize: "var(--font-h2)",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              lineHeight: 1.1,
              marginBottom: "3rem",
              maxWidth: 560,
            }}
          >
            Every service designed to compound.
          </h2>
        </Up>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {SERVICES.map((svc, i) => (
            <Up key={svc.num} delay={i * 0.08}>
              <ServiceCard svc={svc} />
            </Up>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ svc }: { svc: (typeof SERVICES)[0] }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "var(--graphite)",
        border: `1px solid ${hovered ? "var(--line)" : "var(--line)"}`,
        borderRadius: "20px",
        padding: "2rem",
        transition: "border-color 0.3s",
        borderColor: hovered ? "rgba(200,255,74,0.25)" : "var(--line)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr auto",
          gap: "1.5rem",
          alignItems: "start",
        }}
        className="svc-grid"
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.65rem",
            letterSpacing: "0.14em",
            color: "var(--signal)",
            paddingTop: "0.25rem",
          }}
        >
          {svc.num}
        </span>
        <div>
          <h3
            style={{
              fontSize: "var(--font-h3)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              marginBottom: "0.5rem",
            }}
          >
            {svc.name}
          </h3>
          <p
            style={{
              color: "var(--silver)",
              fontSize: "var(--font-body-lg)",
              marginBottom: "0.75rem",
              lineHeight: 1.6,
            }}
          >
            {svc.outcome}
          </p>
          <p style={{ color: "var(--muted)", fontSize: "0.875rem", lineHeight: 1.65, marginBottom: "1.25rem" }}>
            {svc.desc}
          </p>
          {/* Mini flow */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexWrap: "wrap" }}>
            {svc.flow.map((step, i) => (
              <span key={step} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.6rem",
                    letterSpacing: "0.1em",
                    color: "var(--muted)",
                    background: "var(--elevated)",
                    padding: "0.2rem 0.6rem",
                    borderRadius: "999px",
                    border: "1px solid var(--line)",
                  }}
                >
                  {step}
                </span>
                {i < svc.flow.length - 1 && (
                  <span style={{ color: "var(--line)", fontSize: "0.65rem" }}>→</span>
                )}
              </span>
            ))}
          </div>
        </div>
        <a
          href="/audit"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
            color: "var(--muted)",
            textDecoration: "none",
            fontSize: "0.875rem",
            fontWeight: 500,
            transition: "color 0.2s, transform 0.2s",
            transform: hovered ? "translateX(4px)" : "translateX(0)",
            whiteSpace: "nowrap",
          }}
        >
          Explore
          <ArrowUpRight size={15} />
        </a>
      </div>
      <style>{`
        @media (max-width: 640px) {
          .svc-grid { grid-template-columns: auto 1fr !important; }
          .svc-grid > a { display: none; }
        }
      `}</style>
    </div>
  );
}

// ─── Workflow demo (vertical pin) ──────────────────────────────────────────

function WorkflowDemoSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const steps = [
    { step: "01", label: "Lead Submitted", note: "Visitor fills form or sends WhatsApp", time: "0s", auto: true },
    { step: "02", label: "Duplicate Check", note: "System verifies if contact exists in CRM", time: "< 1s", auto: true },
    { step: "03", label: "Company Validation", note: "Business data enriched from public sources", time: "< 2s", auto: true },
    { step: "04", label: "Lead Score", note: "Score based on industry, size, budget and behavior", time: "< 2s", auto: true },
    { step: "05", label: "CRM Record Created", note: "Contact and deal created with full context", time: "< 3s", auto: true },
    { step: "06", label: "WhatsApp Sent", note: "Personalized acknowledgement to lead", time: "< 5s", auto: true },
    { step: "07", label: "Rep Alerted", note: "Sales rep receives notification with summary", time: "< 5s", auto: true },
    { step: "08", label: "Follow-Up Scheduled", note: "Automated sequence begins if rep doesn't respond", time: "< 30s", auto: true },
    { step: "09", label: "Human Review", note: "High-value or complex leads flagged for manual handling", time: "Async", auto: false },
    { step: "10", label: "Dashboard Updated", note: "All metrics and attribution recorded in real time", time: "< 60s", auto: true },
  ];

  useEffect(() => {
    if (reduce || !sectionRef.current || !leftRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: leftRef.current,
        pinSpacing: false,
      });

      gsap.utils.toArray<HTMLElement>(".workflow-step").forEach((step) => {
        gsap.to(step, {
          opacity: 1,
          borderColor: "rgba(200,255,74,0.3)",
          duration: 0.4,
          scrollTrigger: {
            trigger: step,
            start: "top 65%",
            toggleActions: "play none none reverse",
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reduce]);

  return (
    <section
      ref={sectionRef}
      id="workflow"
      style={{
        background: "var(--carbon)",
        minHeight: reduce ? "auto" : `${steps.length * 130 + 200}px`,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: reduce ? "1fr" : "1fr 1fr",
          maxWidth: 1280,
          margin: "0 auto",
        }}
      >
        {/* Left sticky */}
        <div
          ref={leftRef}
          style={{
            padding: reduce ? "4rem 2rem 2rem" : "6rem 4rem 6rem 2rem",
            ...(reduce ? {} : { position: "sticky", top: 0, height: "100vh" }),
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <span className="eyebrow">WORKFLOW DEMO</span>
          <h2
            style={{
              fontSize: "var(--font-h2)",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              lineHeight: 1.1,
              marginBottom: "1.25rem",
            }}
          >
            See what happens after a lead clicks Submit.
          </h2>
          <p style={{ color: "var(--silver)", lineHeight: 1.7, marginBottom: "1.5rem" }}>
            Every action is automated, logged and traceable. Human review is built into
            the flow, not bolted on after.
          </p>
          <div
            style={{
              padding: "1rem 1.25rem",
              borderRadius: "12px",
              background: "var(--graphite)",
              border: "1px solid var(--line)",
            }}
          >
            <p style={{ color: "var(--muted)", fontSize: "0.8rem", lineHeight: 1.6 }}>
              Illustrative example. Actual workflow architecture depends on your tools,
              channels and requirements.
            </p>
          </div>
        </div>

        {/* Right scrolling steps */}
        <div style={{ padding: reduce ? "2rem" : "6rem 2rem 6rem 0", display: "flex", flexDirection: "column", gap: "1rem" }}>
          {steps.map((step) => (
            <div
              key={step.step}
              className="workflow-step"
              style={{
                background: "var(--graphite)",
                border: "1px solid var(--line)",
                borderRadius: "16px",
                padding: "1.5rem",
                opacity: reduce ? 1 : 0.35,
                transition: "opacity 0.4s, border-color 0.4s",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        color: "var(--signal)",
                        fontSize: "0.6rem",
                        letterSpacing: "0.12em",
                      }}
                    >
                      {step.step}
                    </span>
                    <span
                      style={{
                        fontSize: "0.6rem",
                        padding: "2px 8px",
                        borderRadius: "999px",
                        background: step.auto
                          ? "rgba(200,255,74,0.1)"
                          : "rgba(255,188,74,0.1)",
                        color: step.auto ? "#C8FF4A" : "#FFBC4A",
                        fontFamily: "var(--font-mono)",
                        letterSpacing: "0.08em",
                      }}
                    >
                      {step.auto ? "AUTOMATED" : "HUMAN REVIEW"}
                    </span>
                  </div>
                  <h4 style={{ fontWeight: 600, marginBottom: "0.25rem", fontSize: "0.95rem" }}>
                    {step.label}
                  </h4>
                  <p style={{ color: "var(--muted)", fontSize: "0.825rem" }}>{step.note}</p>
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: "var(--muted)",
                    fontSize: "0.7rem",
                    flexShrink: 0,
                    marginLeft: "1rem",
                    paddingTop: "0.1rem",
                  }}
                >
                  {step.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Metrics section ───────────────────────────────────────────────────────

function MetricsSection() {
  const metrics = [
    {
      value: "< 5s",
      label: "Response Time",
      sub: "From form submission to WhatsApp acknowledgement",
    },
    {
      value: "Up to 50%",
      label: "Manual Work Reduced",
      sub: "In qualified workflows after structured audit",
    },
    {
      value: "100%",
      label: "Follow-Up",
      sub: "Automated sequences never forget a next action",
    },
    {
      value: "1 Flow",
      label: "End-to-End Visibility",
      sub: "From first touch to closed deal, traceable",
    },
  ];

  return (
    <section style={{ padding: "6rem 2rem", background: "var(--ink)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1.5rem",
            marginBottom: "2rem",
          }}
        >
          {metrics.map((m, i) => (
            <Up key={m.label} delay={i * 0.08}>
              <div
                style={{
                  background: "var(--graphite)",
                  border: "1px solid var(--line)",
                  borderRadius: "20px",
                  padding: "2rem",
                }}
              >
                <div
                  style={{
                    fontSize: "clamp(2rem, 4vw, 3.25rem)",
                    fontWeight: 700,
                    letterSpacing: "-0.03em",
                    color: "var(--signal)",
                    lineHeight: 1,
                    marginBottom: "0.75rem",
                  }}
                >
                  {m.value}
                </div>
                <div style={{ fontWeight: 600, marginBottom: "0.5rem", fontSize: "1rem" }}>
                  {m.label}
                </div>
                <div style={{ color: "var(--muted)", fontSize: "0.825rem", lineHeight: 1.55 }}>
                  {m.sub}
                </div>
              </div>
            </Up>
          ))}
        </div>
        <Up delay={0.3}>
          <p style={{ color: "var(--muted)", fontSize: "0.75rem", fontFamily: "var(--font-mono)", letterSpacing: "0.04em" }}>
            * Outcome estimates. Final results depend on workflow scope, implementation
            quality and measurement period.
          </p>
        </Up>
      </div>
    </section>
  );
}

// ─── Work / case studies ───────────────────────────────────────────────────

function WorkSection() {
  const projects = [
    {
      category: "Construction · Web Experience · Lead Capture",
      year: "2026",
      title: "Ladhard Homes",
      tagline: "Built to establish trust before the first handshake.",
      scope: ["Strategy", "UI/UX", "Development", "Lead Generation"],
      href: "https://landhar-homes.vercel.app",
      accent: "#43D17D",
      num: "01",
    },
    {
      category: "Food & Hospitality · Web Experience · Ordering Funnel",
      year: "2026",
      title: "Food Project",
      tagline: "Every design decision calibrated to trigger appetite.",
      scope: ["Brand Direction", "Visual Design", "Development", "Menu UX"],
      href: "#",
      accent: "#FFBC4A",
      num: "02",
      note: "Name to be confirmed",
    },
  ];

  return (
    <section id="work" style={{ padding: "6rem 2rem", background: "var(--carbon)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <Up>
          <span className="eyebrow">SELECTED WORK</span>
          <h2
            style={{
              fontSize: "var(--font-h2)",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              lineHeight: 1.1,
              marginBottom: "3rem",
              maxWidth: 560,
            }}
          >
            Selected work across systems, brands and digital experiences.
          </h2>
        </Up>

        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {projects.map((p, i) => (
            <Up key={p.num} delay={i * 0.15}>
              <ProjectRow project={p} reverse={i % 2 !== 0} />
            </Up>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectRow({
  project,
  reverse,
}: {
  project: {
    category: string;
    year: string;
    title: string;
    tagline: string;
    scope: string[];
    href: string;
    accent: string;
    num: string;
    note?: string;
  };
  reverse: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "2rem",
        direction: reverse ? "rtl" : "ltr",
        background: "var(--graphite)",
        border: "1px solid var(--line)",
        borderRadius: "24px",
        overflow: "hidden",
        transition: "border-color 0.3s",
        borderColor: hovered ? `${project.accent}40` : "var(--line)",
      }}
      className="project-row"
    >
      {/* Image placeholder */}
      <div
        style={{
          direction: "ltr",
          background: `linear-gradient(135deg, ${project.accent}18, ${project.accent}06)`,
          minHeight: 300,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "clamp(4rem, 10vw, 8rem)",
            fontWeight: 700,
            color: `${project.accent}20`,
            letterSpacing: "-0.05em",
            userSelect: "none",
          }}
        >
          {project.num}
        </span>
        <div
          style={{
            position: "absolute",
            bottom: "1.5rem",
            left: "1.5rem",
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: project.accent,
            opacity: hovered ? 1 : 0.4,
            transition: "opacity 0.3s",
          }}
        />
      </div>

      {/* Content */}
      <div
        style={{
          direction: "ltr",
          padding: "2.5rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.6rem",
              letterSpacing: "0.1em",
              color: "var(--muted)",
              background: "var(--elevated)",
              padding: "0.25rem 0.75rem",
              borderRadius: "999px",
              border: "1px solid var(--line)",
            }}
          >
            {project.category}
          </span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--muted)" }}>
            {project.year}
          </span>
        </div>

        <h3
          style={{
            fontSize: "var(--font-h3)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            marginBottom: "0.5rem",
          }}
        >
          {project.title}
          {project.note && (
            <span style={{ fontSize: "0.7rem", color: "var(--muted)", marginLeft: "0.75rem", fontWeight: 400 }}>
              ({project.note})
            </span>
          )}
        </h3>
        <p style={{ color: "var(--silver)", fontSize: "1.05rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
          {project.tagline}
        </p>

        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "1.75rem" }}>
          {project.scope.map((s) => (
            <span
              key={s}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.6rem",
                letterSpacing: "0.08em",
                color: "var(--muted)",
                border: "1px solid var(--line)",
                padding: "0.2rem 0.6rem",
                borderRadius: "999px",
              }}
            >
              {s}
            </span>
          ))}
        </div>

        {project.href !== "#" && (
          <a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              color: project.accent,
              textDecoration: "none",
              fontSize: "0.875rem",
              fontWeight: 600,
              transition: "gap 0.2s",
            }}
          >
            View project
            <ArrowUpRight size={15} />
          </a>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .project-row { grid-template-columns: 1fr !important; direction: ltr !important; }
        }
      `}</style>
    </div>
  );
}

// ─── Process section ───────────────────────────────────────────────────────

function ProcessSection() {
  const steps = [
    {
      num: "01",
      title: "Diagnose",
      body: "We audit your current operations — tools, workflows, lead flow and gaps — to identify where time and opportunities are being lost.",
    },
    {
      num: "02",
      title: "Design",
      body: "We map the system architecture: automation flows, CRM structure, content strategy and conversion points, tailored to your business.",
    },
    {
      num: "03",
      title: "Implement",
      body: "We build and connect all components — integrations, automations, web experiences and dashboards — with zero disruption to operations.",
    },
    {
      num: "04",
      title: "Train",
      body: "Your team receives full documentation and live walkthroughs so every system is understood, owned and used correctly from day one.",
    },
    {
      num: "05",
      title: "Optimize",
      body: "We monitor performance, run improvements and adapt the system as your business grows. Results compound over time.",
    },
  ];

  return (
    <section id="process" style={{ padding: "6rem 2rem", background: "var(--ink)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <Up>
          <span className="eyebrow">HOW WE WORK</span>
          <h2
            style={{
              fontSize: "var(--font-h2)",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              lineHeight: 1.1,
              marginBottom: "3rem",
              maxWidth: 560,
            }}
          >
            Diagnose first. Build second. Measure continuously.
          </h2>
        </Up>

        <div style={{ position: "relative" }}>
          {/* Vertical line */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 0,
              bottom: 0,
              width: 1,
              background: "var(--line)",
              transform: "translateX(-50%)",
            }}
            className="process-line"
          />

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {steps.map((step, i) => (
              <Up key={step.num} delay={i * 0.1}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: i % 2 === 0 ? "1fr auto 1fr" : "1fr auto 1fr",
                    gap: "2rem",
                    alignItems: "center",
                  }}
                  className="process-step-grid"
                >
                  {/* Left content (odd) or spacer (even) */}
                  <div style={{ textAlign: "right" }} className={i % 2 !== 0 ? "process-hide-left" : ""}>
                    {i % 2 === 0 && (
                      <div
                        style={{
                          display: "inline-block",
                          textAlign: "left",
                          background: "var(--graphite)",
                          border: "1px solid var(--line)",
                          borderRadius: "16px",
                          padding: "1.75rem",
                          maxWidth: 400,
                        }}
                      >
                        <h3 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "0.5rem" }}>
                          {step.title}
                        </h3>
                        <p style={{ color: "var(--silver)", fontSize: "0.875rem", lineHeight: 1.65 }}>
                          {step.body}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Center dot */}
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      background: "var(--graphite)",
                      border: "2px solid var(--signal)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 1,
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.65rem",
                        letterSpacing: "0.1em",
                        color: "var(--signal)",
                      }}
                    >
                      {step.num}
                    </span>
                  </div>

                  {/* Right content (even) or spacer (odd) */}
                  <div>
                    {i % 2 !== 0 && (
                      <div
                        style={{
                          background: "var(--graphite)",
                          border: "1px solid var(--line)",
                          borderRadius: "16px",
                          padding: "1.75rem",
                          maxWidth: 400,
                        }}
                      >
                        <h3 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "0.5rem" }}>
                          {step.title}
                        </h3>
                        <p style={{ color: "var(--silver)", fontSize: "0.875rem", lineHeight: 1.65 }}>
                          {step.body}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Up>
            ))}
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .process-line { display: none; }
            .process-step-grid { grid-template-columns: auto 1fr !important; }
            .process-hide-left { display: none; }
          }
        `}</style>
      </div>
    </section>
  );
}

// ─── About section ─────────────────────────────────────────────────────────

function AboutSection() {
  const capabilities = [
    "AI and automation architecture",
    "Marketing and funnel strategy",
    "CRM and lead operations",
    "Web design and development",
    "AI content and creative production",
    "Multilingual communication (ES / EN)",
  ];

  const integrations = [
    "n8n", "Make", "OpenAI", "Claude", "Gemini", "HubSpot",
    "Airtable", "WhatsApp", "Vapi", "Retell", "Twilio",
    "ElevenLabs", "Google Workspace", "Calendly",
  ];

  return (
    <section id="about" style={{ padding: "6rem 2rem", background: "var(--carbon)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "5rem",
            alignItems: "start",
          }}
          className="about-grid"
        >
          <div>
            <Up>
              <span className="eyebrow">ABOUT</span>
              <h2
                style={{
                  fontSize: "var(--font-h2)",
                  fontWeight: 700,
                  letterSpacing: "-0.025em",
                  lineHeight: 1.1,
                  marginBottom: "1.5rem",
                }}
              >
                Strategy, creative execution and systems thinking in one partner.
              </h2>
            </Up>
            <Up delay={0.1}>
              <p style={{ color: "var(--silver)", lineHeight: 1.75, marginBottom: "1.25rem" }}>
                I&apos;m Edouard Weed Kerwing, a Growth Partner working across AI automation,
                digital strategy, marketing systems and web development. I help businesses move
                from scattered tools and manual follow-up to connected systems that are easier to
                operate and easier to scale.
              </p>
              <p style={{ color: "var(--silver)", lineHeight: 1.75 }}>
                My role is not limited to delivering a website or one automation. I work across the
                full business path — how attention is generated, how leads are captured, how teams
                respond, how information moves and how performance is measured.
              </p>
            </Up>
          </div>

          <div>
            <Up delay={0.15}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "1.25rem" }}>
                Capability areas
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "2.5rem" }}>
                {capabilities.map((cap) => (
                  <span
                    key={cap}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.65rem",
                      letterSpacing: "0.06em",
                      color: "var(--cloud)",
                      border: "1px solid var(--line)",
                      background: "var(--elevated)",
                      padding: "0.35rem 0.85rem",
                      borderRadius: "999px",
                    }}
                  >
                    {cap}
                  </span>
                ))}
              </div>

              <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "1.25rem" }}>
                Integrations
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                {integrations.map((tool) => (
                  <span
                    key={tool}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.6rem",
                      letterSpacing: "0.08em",
                      color: "var(--muted)",
                      border: "1px solid var(--line)",
                      background: "var(--graphite)",
                      padding: "0.25rem 0.6rem",
                      borderRadius: "999px",
                    }}
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </Up>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .about-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
        }
      `}</style>
    </section>
  );
}

// ─── Pricing section ───────────────────────────────────────────────────────

function PricingSection() {
  const plans = [
    {
      name: "System Audit",
      price: "From RD$25,000",
      desc: "Find operational bottlenecks, lost leads and automation opportunities across your current stack.",
      featured: false,
    },
    {
      name: "Growth Website",
      price: "From RD$95,000",
      desc: "Conversion website connected to analytics, CRM and automation — built to generate measurable results.",
      featured: true,
    },
    {
      name: "AI Operations System",
      price: "From RD$120,000",
      desc: "Custom automation system designed around a specific operational process, from audit to deployment.",
      featured: false,
    },
    {
      name: "Growth Partner",
      price: "From RD$75,000/mo",
      desc: "Continuous growth strategy, automation, CRM and conversion optimization as an ongoing engagement.",
      featured: false,
    },
  ];

  return (
    <section id="pricing" style={{ padding: "6rem 2rem", background: "var(--ink)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <Up>
          <span className="eyebrow">INVESTMENT</span>
          <h2
            style={{
              fontSize: "var(--font-h2)",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              lineHeight: 1.1,
              marginBottom: "1rem",
              maxWidth: 560,
            }}
          >
            Built around the value and complexity of the system.
          </h2>
          <p style={{ color: "var(--silver)", marginBottom: "3rem", maxWidth: 520 }}>
            Final investment depends on workflow complexity, integrations, data quality,
            channels and support level. Third-party platform and usage costs are quoted separately.
          </p>
        </Up>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1.25rem",
            marginBottom: "2.5rem",
          }}
        >
          {plans.map((plan, i) => (
            <Up key={plan.name} delay={i * 0.08}>
              <div
                style={{
                  background: plan.featured ? "var(--graphite)" : "var(--carbon)",
                  border: plan.featured ? "1.5px solid var(--signal)" : "1px solid var(--line)",
                  borderRadius: "20px",
                  padding: "2rem",
                  height: "100%",
                  position: "relative",
                  transform: plan.featured ? "scale(1.02)" : "scale(1)",
                }}
              >
                {plan.featured && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-1px",
                      right: "1.5rem",
                      background: "var(--signal)",
                      color: "var(--ink)",
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.55rem",
                      letterSpacing: "0.12em",
                      padding: "0.2rem 0.6rem",
                      borderRadius: "0 0 8px 8px",
                      fontWeight: 700,
                    }}
                  >
                    FEATURED
                  </span>
                )}
                <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.5rem" }}>
                  {plan.name}
                </h3>
                <div
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: "var(--signal)",
                    marginBottom: "1rem",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {plan.price}
                </div>
                <p style={{ color: "var(--silver)", fontSize: "0.875rem", lineHeight: 1.65 }}>
                  {plan.desc}
                </p>
              </div>
            </Up>
          ))}
        </div>

        <Up delay={0.35}>
          <div style={{ textAlign: "center" }}>
            <a
              href="/audit"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "var(--signal-soft)",
                border: "1px solid rgba(200,255,74,0.25)",
                color: "var(--signal)",
                padding: "0.875rem 2rem",
                borderRadius: "10px",
                fontWeight: 600,
                fontSize: "0.9rem",
                textDecoration: "none",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(200,255,74,0.18)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "var(--signal-soft)")
              }
            >
              Request a scoped recommendation
              <ArrowRight size={15} />
            </a>
          </div>
        </Up>
      </div>
    </section>
  );
}

// ─── Final CTA ─────────────────────────────────────────────────────────────

function FinalCTA() {
  return (
    <section
      style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "6rem 2rem",
        background: "var(--carbon)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background accent */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(200,255,74,0.04) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: 700, textAlign: "center", position: "relative" }}>
        <Up>
          <span className="eyebrow" style={{ textAlign: "center", display: "block" }}>
            READY TO START
          </span>
          <h2
            style={{
              fontSize: "var(--font-h2)",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              lineHeight: 1.1,
              marginBottom: "1.25rem",
            }}
          >
            Your next growth problem may already be an automation problem.
          </h2>
          <p
            style={{
              color: "var(--silver)",
              fontSize: "var(--font-body-lg)",
              lineHeight: 1.7,
              marginBottom: "2.5rem",
            }}
          >
            Let&apos;s identify where your business loses time, leads or visibility — and
            design the system that fixes it.
          </p>
        </Up>

        <Up delay={0.15}>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <a
              href="/audit"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "var(--signal)",
                color: "var(--ink)",
                padding: "1rem 2rem",
                borderRadius: "12px",
                fontWeight: 700,
                fontSize: "1rem",
                textDecoration: "none",
                transition: "opacity 0.2s, transform 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.88";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Book a Growth Systems Audit
              <ArrowRight size={17} />
            </a>
            <a
              href="mailto:hello@edouardautomations.com"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "none",
                border: "1px solid var(--line)",
                color: "var(--silver)",
                padding: "1rem 2rem",
                borderRadius: "12px",
                fontWeight: 500,
                fontSize: "1rem",
                textDecoration: "none",
                transition: "border-color 0.2s, color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--silver)";
                e.currentTarget.style.color = "var(--cloud)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--line)";
                e.currentTarget.style.color = "var(--silver)";
              }}
            >
              Send a Project Brief
            </a>
          </div>

          <div style={{ marginTop: "1.5rem" }}>
            <a
              href="https://wa.me/18098298590"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.7rem",
                letterSpacing: "0.1em",
                color: "var(--muted)",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--cloud)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
            >
              OR MESSAGE ON WHATSAPP →
            </a>
          </div>
        </Up>
      </div>
    </section>
  );
}

// ─── Footer ────────────────────────────────────────────────────────────────

function Footer() {
  const [lang, setLang] = useState<"EN" | "ES">("EN");

  const links = [
    { label: "Services", href: "#services" },
    { label: "Work", href: "#work" },
    { label: "Process", href: "#process" },
    { label: "About", href: "#about" },
    { label: "Audit", href: "/audit" },
  ];

  return (
    <footer
      style={{
        background: "var(--ink)",
        borderTop: "1px solid var(--line)",
        padding: "4rem 2rem 2rem",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "3rem",
            marginBottom: "3rem",
          }}
          className="footer-grid"
        >
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "8px",
                  background: "var(--signal)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-mono)",
                  fontWeight: 700,
                  fontSize: "0.7rem",
                  color: "var(--ink)",
                }}
              >
                EA
              </div>
              <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>Edouard Automations</span>
            </div>
            <p style={{ color: "var(--muted)", fontSize: "0.825rem", lineHeight: 1.6 }}>
              AI Growth Partner
            </p>
          </div>

          {/* Links */}
          <div>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.12em", color: "var(--muted)", marginBottom: "1rem" }}>
              NAVIGATION
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  style={{
                    color: "var(--silver)",
                    textDecoration: "none",
                    fontSize: "0.875rem",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--cloud)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--silver)")}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.12em", color: "var(--muted)", marginBottom: "1rem" }}>
              CONTACT
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              <a
                href="https://wa.me/18098298590"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--silver)", textDecoration: "none", fontSize: "0.875rem", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--cloud)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--silver)")}
              >
                WhatsApp
              </a>
              <a
                href="mailto:hello@edouardautomations.com"
                style={{ color: "var(--silver)", textDecoration: "none", fontSize: "0.875rem", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--cloud)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--silver)")}
              >
                Email
              </a>
            </div>
          </div>
        </div>

        <Line />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: "1.5rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <p style={{ color: "var(--muted)", fontSize: "0.775rem" }}>
              © 2026 Edouard Automations. Santo Domingo, DR.
            </p>
            <p style={{ color: "var(--muted)", fontSize: "0.7rem", marginTop: "0.2rem" }}>
              Designed and built by Weed Kerwing
            </p>
          </div>

          {/* Language toggle */}
          <div
            style={{
              display: "flex",
              border: "1px solid var(--line)",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            {(["EN", "ES"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                style={{
                  background: lang === l ? "var(--signal)" : "none",
                  color: lang === l ? "var(--ink)" : "var(--muted)",
                  border: "none",
                  padding: "0.35rem 0.75rem",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.65rem",
                  letterSpacing: "0.1em",
                  cursor: "pointer",
                  fontWeight: lang === l ? 700 : 400,
                  transition: "background 0.2s, color 0.2s",
                }}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
        }
      `}</style>
    </footer>
  );
}

// ─── Root component ────────────────────────────────────────────────────────

export default function EdouardAutomations() {
  const reduce = useReducedMotion();

  return (
    <ReactLenis
      root
      options={reduce ? { autoRaf: false } : { lerp: 0.1, duration: 1.2, smoothWheel: true }}
    >
      <LenisGSAPSync />
      <ProgressBar />
      <Nav />
      <AnnouncementRail />
      <main>
        <Hero />
        <ProblemSection />
        <GrowthOSSection />
        <ServicesSection />
        <WorkflowDemoSection />
        <MetricsSection />
        <WorkSection />
        <ProcessSection />
        <AboutSection />
        <PricingSection />
        <FinalCTA />
      </main>
      <Footer />
    </ReactLenis>
  );
}
