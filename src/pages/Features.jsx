import Header from "../components/Header";
import Footer from "../components/Footer";
import Glow from "../components/Glow";
import { useSEO } from "../hooks/useSEO";
import { C, cardHover, cardLeave } from "../lib/design";

function Container({ children }) {
    return <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">{children}</div>;
}

function SectionLabel({ children }) {
    return <div style={{ fontFamily: C.mono, color: C.accent, fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "14px" }}>{children}</div>;
}

function SectionHeading({ children }) {
    return <h2 style={{ fontFamily: C.display, fontSize: "clamp(24px,2.8vw,38px)", fontWeight: 900, color: C.text, lineHeight: 1.12, marginBottom: "40px" }}>{children}</h2>;
}

function Divider() {
    return <div style={{ height: "1px", background: `linear-gradient(to right, transparent, ${C.border} 20%, ${C.border} 80%, transparent)`, margin: "0" }} />;
}

function FeatureCard({ icon, title, desc }) {
    return (
        <div
            style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "16px", padding: "28px", transition: "border-color 0.2s, transform 0.2s, box-shadow 0.2s" }}
            onMouseEnter={e => cardHover(e.currentTarget)}
            onMouseLeave={e => cardLeave(e.currentTarget)}
        >
            {icon && (
                <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: C.accentBg, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
                    <span style={{ color: C.accent, fontSize: "16px" }}>{icon}</span>
                </div>
            )}
            <h3 style={{ fontFamily: C.sans, color: C.text, fontSize: "15px", fontWeight: 600 }}>{title}</h3>
            <p style={{ fontFamily: C.sans, color: C.muted, fontSize: "14px", lineHeight: 1.7, marginTop: "8px" }}>{desc}</p>
        </div>
    );
}

export default function Features() {
    useSEO({
        title: "Features — Photo & Video Collection for Events",
        description: "QR code guest uploads, photo and video moderation, bulk downloads, Google Drive sync, PIN-protected galleries and more. Everything you need to collect event media in one shared photo album.",
        canonical: "/features",
        jsonLd: {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Stashed Features — Event Photo & Video Collection Platform",
            "description": "Full feature list for Stashed: QR code uploads, moderation, bulk downloads, Google Drive sync, multiple events management.",
            "url": "https://stashed.krishrp.xyz/features",
            "breadcrumb": {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://stashed.krishrp.xyz/" },
                    { "@type": "ListItem", "position": 2, "name": "Features", "item": "https://stashed.krishrp.xyz/features" }
                ]
            }
        }
    });

    return (
        <div className="min-h-screen" style={{ color: C.text }}>
            <Glow />
            <Header />

            {/* Hero */}
            <section className="pt-24 pb-4 lg:pt-28 lg:pb-10" style={{ position: "relative", zIndex: 1 }}>
                <Container>
                    <div style={{ fontFamily: C.mono, color: C.accent, fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "20px" }}>Platform</div>
                    <h1 style={{ fontFamily: C.display, fontSize: "clamp(34px,4.5vw,58px)", fontWeight: 900, lineHeight: 1.06, letterSpacing: "-0.02em", color: C.text, maxWidth: "700px" }}>
                        Everything you need to collect<br />
                        <em style={{ fontStyle: "italic", color: C.accent }}>event media.</em>
                    </h1>
                    <p style={{ color: C.muted, fontSize: "17px", lineHeight: 1.75, marginTop: "20px", maxWidth: "520px" }}>
                        Stashed keeps uploads simple for guests and gives organisers full control —
                        without apps, logins, or messy group chats.
                    </p>
                </Container>
            </section>

            <Divider />

            {/* Core features */}
            <section className="py-16" style={{ position: "relative", zIndex: 1 }}>
                <Container>
                    <SectionLabel>Core features</SectionLabel>
                    <SectionHeading>
                        Designed for how events<br />
                        <em style={{ fontStyle: "italic", color: C.muted }}>actually work.</em>
                    </SectionHeading>
                    <div className="grid gap-4 md:grid-cols-2">
                        <FeatureCard icon="↑" title="Instant guest uploads"   desc="Guests scan a QR code or open a link and upload straight from their phone. No apps, no accounts, no friction." />
                        <FeatureCard icon="◈" title="Private event galleries"  desc="Every event gets its own secure page so media stays organised and easy to share with clients or teams." />
                        <FeatureCard icon="◉" title="Moderation controls"      desc="Approve uploads before they appear, hide unwanted content, or feature your favourites." />
                        <FeatureCard icon="↓" title="After-event downloads"    desc="Download everything at once as a zip, or export in batches for editing and sharing." />
                    </div>
                </Container>
            </section>

            <Divider />

            {/* Built for organisers */}
            <section className="py-16" style={{ position: "relative", zIndex: 1 }}>
                <Container>
                    <SectionLabel>For organisers</SectionLabel>
                    <SectionHeading>
                        Built for planners<br />
                        <em style={{ fontStyle: "italic", color: C.muted }}>who run multiple events.</em>
                    </SectionHeading>
                    <div className="grid gap-4 md:grid-cols-3">
                        <FeatureCard icon="⊞" title="Run multiple events"    desc="Keep weddings, parties, and corporate events neatly separated in your dashboard." />
                        <FeatureCard icon="◆" title="Client-ready galleries" desc="Share clean, branded galleries with couples, teams, or stakeholders." />
                        <FeatureCard icon="⊕" title="Simple setup"           desc="Create an event in seconds and start collecting uploads immediately." />
                    </div>
                </Container>
            </section>

            <Divider />

            {/* Privacy & security */}
            <section className="py-16" style={{ position: "relative", zIndex: 1 }}>
                <Container>
                    <SectionLabel>Privacy &amp; security</SectionLabel>
                    <SectionHeading>
                        Your data stays<br />
                        <em style={{ fontStyle: "italic", color: C.muted }}>yours.</em>
                    </SectionHeading>
                    <div className="grid gap-4 md:grid-cols-2">
                        <FeatureCard icon="◆" title="Private by default"    desc="Events are only accessible to people with your link or QR code." />
                        <FeatureCard icon="◇" title="Data protection ready" desc="Designed with GDPR in mind — no unnecessary personal data collected." />
                        <FeatureCard icon="↓" title="Control downloads"     desc="Decide who can download media and when." />
                        <FeatureCard icon="◉" title="Safe storage"          desc="Files are stored securely and delivered quickly to your guests." />
                    </div>
                </Container>
            </section>

            <Divider />

            {/* CTA */}
            <section style={{ padding: "80px 0 100px", position: "relative", zIndex: 1 }}>
                <Container>
                    <div style={{ background: C.accentBg, border: `1px solid ${C.border}`, borderRadius: "24px", padding: "clamp(48px,7vw,96px) clamp(32px,5vw,72px)", textAlign: "center", position: "relative", overflow: "hidden" }}>
                        <div aria-hidden="true" style={{ position: "absolute", top: "-40px", left: "50%", transform: "translateX(-50%)", width: "480px", height: "180px", background: "radial-gradient(ellipse, rgba(139,92,246,0.12), transparent)", pointerEvents: "none" }} />
                        <div style={{ position: "relative" }}>
                            <SectionLabel>Get started</SectionLabel>
                            <h2 style={{ fontFamily: C.display, fontSize: "clamp(28px,4vw,50px)", fontWeight: 900, color: C.text, lineHeight: 1.08 }}>
                                Ready to try Stashed?
                            </h2>
                            <p style={{ color: C.muted, fontSize: "16px", lineHeight: 1.75, marginTop: "16px", maxWidth: "360px", margin: "16px auto 0" }}>
                                Get early access and be one of the first to use Stashed for your events.
                            </p>
                            <div style={{ marginTop: "32px" }}>
                                <a
                                    href="/contact"
                                    style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", background: C.accent, color: "#fff", fontFamily: C.sans, fontWeight: 700, fontSize: "15px", borderRadius: "12px", padding: "14px 32px", textDecoration: "none", transition: "background 0.2s" }}
                                    onMouseEnter={e => (e.currentTarget.style.background = C.accentHover)}
                                    onMouseLeave={e => (e.currentTarget.style.background = C.accent)}
                                >
                                    Get early access →
                                </a>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

            <Footer />
        </div>
    );
}
