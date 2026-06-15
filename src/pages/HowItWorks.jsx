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

function MiniCard({ icon, title, desc }) {
    return (
        <div
            style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "16px", padding: "24px", transition: "border-color 0.2s, transform 0.2s, box-shadow 0.2s" }}
            onMouseEnter={e => cardHover(e.currentTarget)}
            onMouseLeave={e => cardLeave(e.currentTarget)}
        >
            {icon && (
                <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: C.accentBg, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px" }}>
                    <span style={{ color: C.accent, fontSize: "14px" }}>{icon}</span>
                </div>
            )}
            <h3 style={{ fontFamily: C.sans, color: C.text, fontSize: "15px", fontWeight: 600 }}>{title}</h3>
            <p style={{ fontFamily: C.sans, color: C.muted, fontSize: "14px", lineHeight: 1.7, marginTop: "8px" }}>{desc}</p>
        </div>
    );
}

export default function HowItWorks() {
    useSEO({
        title: "How to Collect Photos & Videos from Event Guests",
        description: "Create an event, share a QR code or link, and guests upload photos and videos instantly — no app needed. See how Stashed makes collecting event media effortless in 3 simple steps.",
        canonical: "/how-it-works",
        jsonLd: {
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to collect photos and videos from event guests using Stashed",
            "description": "A 3-step guide to collecting photos and videos from guests at weddings, parties, corporate events and more.",
            "url": "https://stashedmedia.krishrp.xyz/how-it-works",
            "step": [
                { "@type": "HowToStep", "position": 1, "name": "Create an event", "text": "Create an event page in seconds. Set a name, optional PIN, and upload limits." },
                { "@type": "HowToStep", "position": 2, "name": "Share a QR code or link", "text": "Print a QR for tables or share the link in WhatsApp. Guests open it instantly on their phone — no app download or login required." },
                { "@type": "HowToStep", "position": 3, "name": "Review and download", "text": "All uploads arrive in one place. Approve, hide, or feature them. Download everything after the event as a batch." }
            ],
            "breadcrumb": {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://stashedmedia.krishrp.xyz/" },
                    { "@type": "ListItem", "position": 2, "name": "How it works", "item": "https://stashedmedia.krishrp.xyz/how-it-works" }
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
                    <div style={{ fontFamily: C.mono, color: C.accent, fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "20px" }}>Process</div>
                    <h1 style={{ fontFamily: C.display, fontSize: "clamp(34px,4.5vw,58px)", fontWeight: 900, lineHeight: 1.06, letterSpacing: "-0.02em", color: C.text, maxWidth: "620px" }}>
                        How Stashed<br />
                        <em style={{ fontStyle: "italic", color: C.accent }}>works.</em>
                    </h1>
                    <p style={{ color: C.muted, fontSize: "17px", lineHeight: 1.75, marginTop: "20px", maxWidth: "500px" }}>
                        A simple flow for guests, with control for organisers. Set it up in minutes and collect
                        photos + videos from everyone.
                    </p>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "32px" }}>
                        <a
                            href="/signup"
                            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", background: C.accent, color: "#fff", fontFamily: C.sans, fontWeight: 700, fontSize: "14px", borderRadius: "10px", padding: "13px 26px", textDecoration: "none", transition: "background 0.2s" }}
                            onMouseEnter={e => (e.currentTarget.style.background = C.accentHover)}
                            onMouseLeave={e => (e.currentTarget.style.background = C.accent)}
                        >
                            Get Started →
                        </a>
                        <a
                            href="/features"
                            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", border: `1px solid #e4e4e7`, color: C.muted, fontFamily: C.sans, fontSize: "14px", borderRadius: "10px", padding: "13px 22px", textDecoration: "none", background: "#fff", transition: "all 0.2s" }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.text; e.currentTarget.style.background = C.accentBg; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = "#e4e4e7"; e.currentTarget.style.color = C.muted; e.currentTarget.style.background = "#fff"; }}
                        >
                            View features
                        </a>
                    </div>
                </Container>
            </section>

            <Divider />

            {/* Steps */}
            <section className="py-16" style={{ position: "relative", zIndex: 1 }}>
                <Container>
                    <SectionLabel>The flow</SectionLabel>
                    <SectionHeading>
                        Three steps.<br />
                        <em style={{ fontStyle: "italic", color: C.muted }}>That's it.</em>
                    </SectionHeading>
                    <div className="grid gap-10 md:grid-cols-3">
                        <StepCard num="01" title="Create an event"           desc="Name your event, set optional controls (PIN, upload limits), and generate a share link + QR code." />
                        <StepCard num="02" title="Share the QR code or link" desc="Print the QR for tables, add it to invites, or drop the link into WhatsApp. Guests open it instantly." />
                        <StepCard num="03" title="Collect, review & download" desc="Uploads arrive in one place. Download everything after the event and control visibility to your clients." />
                    </div>
                </Container>
            </section>

            <Divider />

            {/* Guest experience */}
            <section className="py-16" style={{ position: "relative", zIndex: 1 }}>
                <Container>
                    <SectionLabel>Guest experience</SectionLabel>
                    <SectionHeading>
                        Zero friction<br />
                        <em style={{ fontStyle: "italic", color: C.muted }}>for your guests.</em>
                    </SectionHeading>
                    <div className="grid gap-4 md:grid-cols-2">
                        <MiniCard icon="◈" title="No apps, no logins" desc="Guests just open the link and upload. Works great on iPhone and Android with a mobile-first UI." />
                        <MiniCard icon="↑" title="Fast uploads"        desc="Upload photos and short videos with a simple picker. Clear progress so guests know it worked." />
                        <MiniCard icon="◆" title="Optional PIN"        desc="Add a PIN to keep the event private while still keeping the guest flow friction-free." />
                        <MiniCard icon="◉" title="Clean gallery"       desc="Guests can browse what's been shared (optional). Organisers decide what's visible." />
                    </div>
                </Container>
            </section>

            <Divider />

            {/* Organiser controls */}
            <section className="py-16" style={{ position: "relative", zIndex: 1 }}>
                <Container>
                    <SectionLabel>Organiser controls</SectionLabel>
                    <SectionHeading>
                        Full control<br />
                        <em style={{ fontStyle: "italic", color: C.muted }}>after the event.</em>
                    </SectionHeading>
                    <div className="grid gap-4 md:grid-cols-3">
                        <MiniCard icon="◉" title="Moderation"      desc="Approve before public display, hide unwanted uploads, and feature your favourites." />
                        <MiniCard icon="↓" title="Downloads"       desc="Download everything as a zip, or export in batches for editing and sharing." />
                        <MiniCard icon="⊞" title="Multiple events" desc="Perfect for planners: keep each client and event neatly organised in one dashboard." />
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
                                Want to use Stashed<br />
                                <em style={{ fontStyle: "italic", color: C.accent }}>for your next event?</em>
                            </h2>
                            <p style={{ color: C.muted, fontSize: "16px", lineHeight: 1.75, marginTop: "16px", maxWidth: "380px", margin: "16px auto 0" }}>
                                Leave your email and we'll message you when the first version is ready.
                            </p>
                            <div style={{ marginTop: "32px" }}>
                                <a
                                    href="/signup"
                                    style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", background: C.accent, color: "#fff", fontFamily: C.sans, fontWeight: 700, fontSize: "15px", borderRadius: "12px", padding: "14px 32px", textDecoration: "none", transition: "background 0.2s" }}
                                    onMouseEnter={e => (e.currentTarget.style.background = C.accentHover)}
                                    onMouseLeave={e => (e.currentTarget.style.background = C.accent)}
                                >
                                    Get Started →
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
