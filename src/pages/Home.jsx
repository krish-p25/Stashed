import { useRef } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Glow from "../components/Glow";
import { useSEO } from "../hooks/useSEO";

// ── Design tokens (white / violet palette) ─────────────────────────────────────
const C = {
    bg:      "#ffffff",
    surface: "#faf9ff",
    card:    "#ffffff",
    border:  "#ddd6fe",   // violet-200
    borderHover: "#c4b5fd", // violet-300
    text:    "#18181b",   // zinc-900
    muted:   "#52525b",   // zinc-600
    dim:     "#a1a1aa",   // zinc-400
    accent:  "#7c3aed",   // violet-600
    accentHover: "#6d28d9", // violet-700
    accentBg:    "#f5f3ff", // violet-50
    accentBgMed: "#ede9fe", // violet-100
    display: "'Playfair Display', Georgia, serif",
    mono:    "'DM Mono', 'Courier New', monospace",
    sans:    "'DM Sans', system-ui, sans-serif",
};

// Violet-tinted photo thumbnail gradients
const THUMBS = [
    "linear-gradient(135deg,#ede9fe,#ddd6fe)",
    "linear-gradient(135deg,#f5f3ff,#e0e7ff)",
    "linear-gradient(135deg,#e0e7ff,#c7d2fe)",
    "linear-gradient(135deg,#f0f0ff,#e8e0ff)",
    "linear-gradient(135deg,#ede9fe,#e0e7ff)",
    "linear-gradient(135deg,#f5f3ff,#ede9fe)",
    "linear-gradient(135deg,#e8e0ff,#ddd6fe)",
    "linear-gradient(135deg,#e0e7ff,#ede9fe)",
    "linear-gradient(135deg,#f0ebff,#e0e7ff)",
];

const REVIEWS = [
    { quote: "We used Stashed at our wedding and it was a game-changer. Everyone uploaded instantly and we had everything in one place the next day.", name: "Sarah & Tom", meta: "Wedding, London" },
    { quote: "Perfect for corporate events. No chasing people for photos — the QR code did all the work.", name: "Mahesh Patel", meta: "Event Manager" },
    { quote: "Clean, simple, and exactly what guests want. We now use Stashed for every client event.", name: "Amelia Rhodes", meta: "Wedding Planner" },
    { quote: "The gallery felt premium and the admin controls were simple. Clients love the after-event download.", name: "Maya S.", meta: "Event Coordinator" },
    { quote: "Guests actually used it. That's the biggest win — no app installs and no friction.", name: "Ollie K.", meta: "Birthday Host" },
    { quote: "We printed the QR codes for tables and the uploads just flowed in. Brilliant for candid moments.", name: "Hannah & Imran", meta: "Wedding, Manchester" },
    { quote: "For conferences, it's a great way to collect attendee content and speaker highlights in one place.", name: "Daniel W.", meta: "Conference Organiser" },
];

const USE_CASES = [
    { title: "Weddings",    desc: "Collect every guest's candid moments — no chasing uploads."      },
    { title: "Corporate",   desc: "Centralise media for internal recaps and social content."         },
    { title: "Parties",     desc: "One link for everyone. No group chats needed."                   },
    { title: "Conferences", desc: "Capture attendee content and speaker highlights in one place."   },
];

// ── Sub-components ─────────────────────────────────────────────────────────────
function SectionLabel({ children }) {
    return (
        <div style={{ fontFamily: C.mono, color: C.accent, fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "14px" }}>
            {children}
        </div>
    );
}

function SectionHeading({ children }) {
    return (
        <h2 style={{ fontFamily: C.display, fontSize: "clamp(26px,3.2vw,42px)", fontWeight: 900, color: C.text, lineHeight: 1.12, marginBottom: "48px" }}>
            {children}
        </h2>
    );
}

function Divider() {
    return <div style={{ height: "1px", background: `linear-gradient(to right, transparent, ${C.border} 20%, ${C.border} 80%, transparent)` }} />;
}

function StepCard({ num, title, desc }) {
    return (
        <div>
            <div style={{ fontFamily: C.display, fontSize: "72px", fontWeight: 900, color: C.accentBgMed, lineHeight: 1, userSelect: "none", marginBottom: "-12px" }}>{num}</div>
            <div style={{ height: "1px", background: C.border, margin: "0 0 18px" }} />
            <h3 style={{ fontFamily: C.sans, color: C.text, fontSize: "16px", fontWeight: 600 }}>{title}</h3>
            <p style={{ fontFamily: C.sans, color: C.muted, fontSize: "14px", lineHeight: 1.7, marginTop: "8px" }}>{desc}</p>
        </div>
    );
}

function FeatureCard({ icon, title, desc }) {
    return (
        <div
            style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "16px", padding: "28px", transition: "border-color 0.2s, transform 0.2s, box-shadow 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.borderHover; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(139,92,246,0.1)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
        >
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: C.accentBg, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
                <span style={{ color: C.accent, fontSize: "16px" }}>{icon}</span>
            </div>
            <h3 style={{ fontFamily: C.sans, color: C.text, fontSize: "15px", fontWeight: 600 }}>{title}</h3>
            <p style={{ fontFamily: C.sans, color: C.muted, fontSize: "14px", lineHeight: 1.7, marginTop: "8px" }}>{desc}</p>
        </div>
    );
}

function ReviewCard({ quote, name, meta }) {
    return (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "16px", padding: "24px", minWidth: "300px", maxWidth: "300px", flexShrink: 0 }}>
            <div style={{ color: C.accent, fontFamily: C.mono, fontSize: "32px", lineHeight: 1, opacity: 0.5, marginBottom: "4px" }}>"</div>
            <p style={{ color: C.muted, fontFamily: C.sans, fontSize: "14px", lineHeight: 1.75 }}>{quote}</p>
            <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: `1px solid ${C.border}` }}>
                <div style={{ color: C.text, fontFamily: C.sans, fontSize: "13px", fontWeight: 600 }}>{name}</div>
                <div style={{ color: C.dim, fontFamily: C.mono, fontSize: "11px", marginTop: "2px", letterSpacing: "0.05em" }}>{meta}</div>
            </div>
        </div>
    );
}

function UseCaseCard({ title, desc }) {
    return (
        <div
            style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "16px", padding: "24px", transition: "border-color 0.2s, transform 0.2s, box-shadow 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.borderHover; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(139,92,246,0.1)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
        >
            <div style={{ fontFamily: C.sans, color: C.text, fontWeight: 600, fontSize: "15px" }}>{title}</div>
            <div style={{ fontFamily: C.sans, color: C.muted, fontSize: "13px", lineHeight: 1.7, marginTop: "8px" }}>{desc}</div>
        </div>
    );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function Home() {
    const scrollerRef = useRef(null);

    useSEO({
        title: "Collect Event Photos & Videos — Shared Photo Album App",
        description: "Stashed is the easiest shared photo album for events. Share a QR code or link, guests upload photos & videos instantly — no app needed. Perfect for weddings, parties, corporate events and conferences.",
        canonical: "/",
        jsonLd: {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Stashed — Shared Photo Album & Event Media Collection",
            "description": "Collect photos and videos from event guests via QR code or link. No app download required. Review, moderate and download everything after your event.",
            "url": "https://stashed.krishrp.xyz/",
            "breadcrumb": {
                "@type": "BreadcrumbList",
                "itemListElement": [{ "@type": "ListItem", "position": 1, "name": "Home", "item": "https://stashed.krishrp.xyz/" }],
            },
        },
    });

    return (
        <div style={{ background: C.bg, minHeight: "100vh", color: C.text }}>
            <Glow />
            <Header />

            <main style={{ position: "relative" }}>

                {/* ── Hero ────────────────────────────────────────────────────── */}
                <section style={{ paddingTop: "128px", paddingBottom: "100px", position: "relative", zIndex: 1 }}>
                    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
                        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">

                            {/* Left — copy */}
                            <div>
                                {/* Label pill */}
                                <div className="home-fade-1" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: C.accentBg, border: `1px solid ${C.border}`, borderRadius: "999px", padding: "5px 14px", marginBottom: "28px" }}>
                                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: C.accent, flexShrink: 0, display: "inline-block", animation: "pulse-dot 2.5s ease-in-out infinite" }} />
                                    <span style={{ fontFamily: C.mono, fontSize: "11px", color: C.accent, letterSpacing: "0.1em", textTransform: "uppercase" }}>Event Media Collection</span>
                                </div>

                                {/* Headline */}
                                <h1 className="home-fade-2" style={{ fontFamily: C.display, fontSize: "clamp(38px,5.2vw,68px)", fontWeight: 900, lineHeight: 1.04, letterSpacing: "-0.02em", color: C.text }}>
                                    Every moment,<br />
                                    <em style={{ fontStyle: "italic", color: C.accent }}>collected.</em>
                                </h1>

                                {/* Sub */}
                                <p className="home-fade-3" style={{ fontFamily: C.sans, color: C.muted, fontSize: "17px", lineHeight: 1.75, marginTop: "22px", maxWidth: "420px" }}>
                                    Share a QR code or link. Guests upload instantly — no app needed. You review, moderate, and download everything after.
                                </p>

                                {/* CTAs */}
                                <div className="home-fade-4" style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "34px" }}>
                                    <a
                                        href="/signup"
                                        style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", background: C.accent, color: "#ffffff", fontFamily: C.sans, fontWeight: 700, fontSize: "14px", borderRadius: "10px", padding: "13px 26px", textDecoration: "none", transition: "background 0.2s" }}
                                        onMouseEnter={e => (e.currentTarget.style.background = C.accentHover)}
                                        onMouseLeave={e => (e.currentTarget.style.background = C.accent)}
                                    >
                                        Get Started →
                                    </a>
                                    <a
                                        href="/how-it-works"
                                        style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", border: `1px solid #e4e4e7`, color: C.muted, fontFamily: C.sans, fontSize: "14px", borderRadius: "10px", padding: "13px 22px", textDecoration: "none", background: "#ffffff", transition: "all 0.2s" }}
                                        onMouseEnter={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.text; e.currentTarget.style.background = C.accentBg; }}
                                        onMouseLeave={e => { e.currentTarget.style.borderColor = "#e4e4e7"; e.currentTarget.style.color = C.muted; e.currentTarget.style.background = "#ffffff"; }}
                                    >
                                        How it works
                                    </a>
                                </div>

                                {/* Tags */}
                                <div className="home-fade-5" style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "26px" }}>
                                    {["No app required", "QR or link share", "Guest uploads in seconds"].map(t => (
                                        <span key={t} style={{ border: `1px solid ${C.border}`, color: "#7c3aed", background: C.accentBg, fontFamily: C.mono, fontSize: "11px", borderRadius: "999px", padding: "4px 12px", letterSpacing: "0.04em" }}>{t}</span>
                                    ))}
                                </div>
                            </div>

                            {/* Right — Live gallery mockup */}
                            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "20px", padding: "24px", boxShadow: "0 20px 60px rgba(139,92,246,0.12), 0 4px 16px rgba(139,92,246,0.06)" }}>

                                {/* Event header bar */}
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px" }}>
                                    <div>
                                        <div style={{ fontFamily: C.sans, color: C.text, fontWeight: 600, fontSize: "14px" }}>Summer Wedding</div>
                                        <div style={{ fontFamily: C.mono, color: C.dim, fontSize: "11px", marginTop: "2px", letterSpacing: "0.05em" }}>sarah-tom-2024</div>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "6px", background: C.accentBg, border: `1px solid ${C.border}`, borderRadius: "999px", padding: "5px 12px" }}>
                                        <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: C.accent, display: "inline-block", animation: "pulse-dot 2s ease-in-out infinite" }} />
                                        <span style={{ fontFamily: C.mono, color: C.accent, fontSize: "11px", letterSpacing: "0.05em" }}>47 uploads</span>
                                    </div>
                                </div>

                                {/* Photo grid */}
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                                    {THUMBS.map((bg, i) => (
                                        <div key={i} style={{ background: bg, aspectRatio: "1 / 1", borderRadius: "10px", border: `1px solid ${C.border}` }} aria-hidden="true" />
                                    ))}
                                </div>

                                {/* Latest upload strip */}
                                <div style={{ marginTop: "14px", paddingTop: "14px", borderTop: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: "10px" }}>
                                    <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: THUMBS[2], border: `1px solid ${C.border}`, flexShrink: 0 }} />
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontFamily: C.sans, color: C.text, fontSize: "12px", fontWeight: 500 }}>Guest upload · just now</div>
                                        <div style={{ fontFamily: C.mono, color: C.dim, fontSize: "11px", marginTop: "1px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>ceremony_candid_032.jpg</div>
                                    </div>
                                    <span style={{ fontFamily: C.mono, color: C.accent, fontSize: "11px", flexShrink: 0, background: C.accentBg, border: `1px solid ${C.border}`, borderRadius: "999px", padding: "2px 9px" }}>new</span>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                <Divider />

                {/* ── How it works ────────────────────────────────────────────── */}
                <section style={{ padding: "96px 0", position: "relative", zIndex: 1 }}>
                    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
                        <SectionLabel>Process</SectionLabel>
                        <SectionHeading>
                            Simple for guests.<br />
                            <em style={{ fontStyle: "italic", color: C.muted }}>Controlled for hosts.</em>
                        </SectionHeading>
                        <div className="grid gap-10 md:grid-cols-3">
                            <StepCard num="01" title="Create an event"        desc="Set up an event page in seconds. Add a name, optional PIN protection, and upload limits." />
                            <StepCard num="02" title="Share QR or link"       desc="Print QR codes for tables or send the link via WhatsApp. Guests need no account." />
                            <StepCard num="03" title="Review & download"      desc="Approve, hide, or feature uploads. Download everything as a zip after your event." />
                        </div>
                    </div>
                </section>

                <Divider />

                {/* ── Features ────────────────────────────────────────────────── */}
                <section style={{ padding: "96px 0", position: "relative", zIndex: 1 }}>
                    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
                        <SectionLabel>Features</SectionLabel>
                        <SectionHeading>
                            Built for organisers<br />
                            <em style={{ fontStyle: "italic", color: C.muted }}>who want full control.</em>
                        </SectionHeading>
                        <div className="grid gap-4 md:grid-cols-2">
                            <FeatureCard icon="↑" title="Guest-first uploads"   desc="Mobile-optimised uploader with a clean, fast flow. Guests upload from their camera roll in seconds." />
                            <FeatureCard icon="◉" title="Moderation controls"   desc="Approve uploads before they appear publicly, or open the gallery immediately. Your rules." />
                            <FeatureCard icon="↓" title="After-event downloads" desc="Export your complete media collection as a zip, or download in batches to suit your workflow." />
                            <FeatureCard icon="⊞" title="Multiple events"       desc="Manage all events from one dashboard. Perfect for planners running multiple events per month." />
                        </div>
                    </div>
                </section>

                <Divider />

                {/* ── Reviews ─────────────────────────────────────────────────── */}
                <section style={{ padding: "96px 0", position: "relative", zIndex: 1 }}>
                    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
                        <SectionLabel>Reviews</SectionLabel>
                        <h2 style={{ fontFamily: C.display, fontSize: "clamp(26px,3.2vw,42px)", fontWeight: 900, color: C.text, lineHeight: 1.12, marginBottom: "40px" }}>
                            What organisers say.
                        </h2>
                        <div
                            ref={scrollerRef}
                            style={{ overflowX: "auto", paddingBottom: "8px", scrollbarWidth: "thin", scrollbarColor: `${C.border} transparent`, cursor: "grab" }}
                        >
                            <div style={{ display: "flex", gap: "16px" }}>
                                {REVIEWS.map((r, i) => <ReviewCard key={i} {...r} />)}
                            </div>
                        </div>
                    </div>
                </section>

                <Divider />

                {/* ── Use cases ───────────────────────────────────────────────── */}
                <section style={{ padding: "96px 0", position: "relative", zIndex: 1 }}>
                    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
                        <SectionLabel>Use cases</SectionLabel>
                        <SectionHeading>Made for any event.</SectionHeading>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {USE_CASES.map(uc => <UseCaseCard key={uc.title} {...uc} />)}
                        </div>
                    </div>
                </section>

                <Divider />

                {/* ── CTA ─────────────────────────────────────────────────────── */}
                <section style={{ padding: "80px 0 100px", position: "relative", zIndex: 1 }}>
                    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
                        <div style={{ background: C.accentBg, border: `1px solid ${C.border}`, borderRadius: "24px", padding: "clamp(48px,7vw,96px) clamp(32px,5vw,72px)", textAlign: "center", position: "relative", overflow: "hidden" }}>
                            {/* Ambient violet */}
                            <div aria-hidden="true" style={{ position: "absolute", top: "-40px", left: "50%", transform: "translateX(-50%)", width: "480px", height: "180px", background: "radial-gradient(ellipse, rgba(139,92,246,0.12), transparent)", pointerEvents: "none" }} />

                            <div style={{ position: "relative" }}>
                                <SectionLabel>Get started</SectionLabel>
                                <h2 style={{ fontFamily: C.display, fontSize: "clamp(30px,4.5vw,56px)", fontWeight: 900, color: C.text, lineHeight: 1.08, marginBottom: 0 }}>
                                    Ready to collect<br />
                                    <em style={{ fontStyle: "italic", color: C.accent }}>every moment?</em>
                                </h2>
                                <p style={{ fontFamily: C.sans, color: C.muted, fontSize: "16px", lineHeight: 1.75, marginTop: "20px", maxWidth: "380px", marginLeft: "auto", marginRight: "auto" }}>
                                    Create your first event and start collecting photos and videos today. Free to get started.
                                </p>
                                <div style={{ marginTop: "36px" }}>
                                    <a
                                        href="/signup"
                                        style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", background: C.accent, color: "#ffffff", fontFamily: C.sans, fontWeight: 700, fontSize: "15px", borderRadius: "12px", padding: "15px 34px", textDecoration: "none", transition: "background 0.2s" }}
                                        onMouseEnter={e => (e.currentTarget.style.background = C.accentHover)}
                                        onMouseLeave={e => (e.currentTarget.style.background = C.accent)}
                                    >
                                        Get Started for Free →
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <Footer />
            </main>
        </div>
    );
}
