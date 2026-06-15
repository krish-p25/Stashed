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

function Card({ title, desc, bullets }) {
    return (
        <div
            style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "16px", padding: "28px", transition: "border-color 0.2s, transform 0.2s, box-shadow 0.2s" }}
            onMouseEnter={e => cardHover(e.currentTarget)}
            onMouseLeave={e => cardLeave(e.currentTarget)}
        >
            <h3 style={{ fontFamily: C.sans, color: C.text, fontSize: "15px", fontWeight: 600 }}>{title}</h3>
            <p style={{ fontFamily: C.sans, color: C.muted, fontSize: "14px", lineHeight: 1.7, marginTop: "8px" }}>{desc}</p>
            {bullets?.length ? (
                <ul style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    {bullets.map((b, i) => (
                        <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontFamily: C.sans, color: C.muted, fontSize: "13px", lineHeight: 1.6 }}>
                            <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: C.accent, flexShrink: 0, marginTop: "7px" }} />
                            {b}
                        </li>
                    ))}
                </ul>
            ) : null}
        </div>
    );
}

function MiniCard({ title, desc }) {
    return (
        <div
            style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "16px", padding: "24px", transition: "border-color 0.2s, transform 0.2s, box-shadow 0.2s" }}
            onMouseEnter={e => cardHover(e.currentTarget)}
            onMouseLeave={e => cardLeave(e.currentTarget)}
        >
            <div style={{ fontFamily: C.sans, color: C.text, fontSize: "15px", fontWeight: 600 }}>{title}</div>
            <div style={{ fontFamily: C.sans, color: C.muted, fontSize: "14px", lineHeight: 1.7, marginTop: "8px" }}>{desc}</div>
        </div>
    );
}

export default function UseCases() {
    useSEO({
        title: "Use Cases — Wedding Photo Album, Corporate Events & More",
        description: "Stashed works for weddings, birthday parties, corporate events, conferences, graduations, festivals and community events. The easiest way to collect a shared photo album from guests.",
        canonical: "/use-cases",
        jsonLd: {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Stashed Use Cases — Shared Photo Album for Every Event Type",
            "description": "Wedding photo sharing, corporate event media collection, birthday party albums, conference galleries and more — Stashed handles every event type.",
            "url": "https://stashedmedia.krishrp.xyz/use-cases",
            "breadcrumb": {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://stashedmedia.krishrp.xyz/" },
                    { "@type": "ListItem", "position": 2, "name": "Use Cases", "item": "https://stashedmedia.krishrp.xyz/use-cases" }
                ]
            }
        }
    });

    const useCases = [
        { title: "Weddings", desc: "Collect every guest moment without chasing people after the day. One link, one place, everything organised.", bullets: ["Print QR codes for tables, bar area, or photo booth", "Optional moderation so nothing awkward appears publicly", "Download everything for your photographer / editor after the event", "Perfect for candid, behind-the-scenes moments"] },
        { title: "Wedding planners", desc: "Run multiple events with a consistent workflow. Keep media separated per client, and hand over a clean gallery after.", bullets: ["Separate events per client, no mixing media", "Share link/QR with venue staff and bridal party", "Client-ready downloads and tidy organisation", "Upsell as an add-on to your planning package"] },
        { title: "Corporate events", desc: "Centralise attendee content for internal recaps, marketing, and employer branding — without relying on group chats.", bullets: ["Collect social-friendly content from attendees", "Keep everything in one folder-like gallery", "Optional approval flow before public display", "Useful for conferences, product launches, company socials"] },
        { title: "Conferences & talks", desc: "Capture attendee uploads, speaker highlights, and behind-the-scenes clips across multiple rooms and sessions.", bullets: ["One QR per conference or per session (later: multi-QR)", "Collect audience angles of key moments", "Create a highlight set for sponsors and marketing", "Download all assets for recap content"] },
        { title: "Parties & birthdays", desc: "Stop losing memories in 10 different chats. Guests upload in one place and you keep the best bits forever.", bullets: ["Ideal for big birthday parties and anniversaries", "Guests upload instantly (no reminders needed)", "Private link keeps it contained to your group", "Download everything after the night"] },
        { title: "Festivals & ticketed events", desc: "Let attendees contribute content while you keep control. Great for community events and brand activations.", bullets: ["Collect UGC at scale with a simple flow", "Add moderation controls if you want a public gallery", "Build a recap library for socials and sponsors", "Works well for pop-ups, launches, and activations"] },
        { title: "School & community events", desc: "Centralise photos from parents and volunteers with clear boundaries and privacy controls.", bullets: ["Share QR at the entrance or in newsletters", "Optional PIN to control access", "Keep media separated per event/date", "Download and share a final album with the community"] },
        { title: "Sports teams & tournaments", desc: "Gather photos and clips from different viewpoints — players, parents, coaches — into one organised place.", bullets: ["One place for matchday photos/videos", "Collect highlights across multiple games", "Useful for clubs, academies, tournaments", "Easy downloads for editing and social posts"] },
    ];

    const whyPeopleUseIt = [
        { title: "No app installs",         desc: "Guests are far more likely to upload when it's a link + picker. Reduce drop-off immediately." },
        { title: "Everything in one place",  desc: "Stop losing media across WhatsApp, iMessage, and random Drive links." },
        { title: "Organiser control",        desc: "Moderate uploads, feature favourites, and export clean downloads after the event." },
        { title: "Works for big groups",     desc: "Designed for events with lots of guests and lots of devices — without chaos." },
    ];

    const comparison = [
        { title: "WhatsApp / iMessage",         desc: "Fast but messy",               bullets: ["Media compressed and hard to organise", "People forget to upload", "Multiple chats = lost content", "No moderation or approval controls"] },
        { title: "Google Drive / Dropbox links", desc: "Organised but high friction",  bullets: ["Guests often need accounts/logins", "Uploads on mobile are clunky", "People don't know what folder to use", "Low participation without constant reminders"] },
        { title: "Stashed",                      desc: "Low friction + organiser control", bullets: ["QR/link → instant upload", "No logins, no apps", "Optional moderation and downloads", "Clean gallery workflow for organisers"] },
    ];

    const playbooks = [
        { title: "Wedding table QR playbook",       desc: `Print a QR code for each table. Add a short line: "Upload your best photos from today." You'll get candid moments you'd never see otherwise.` },
        { title: "Corporate event recap playbook",   desc: `Share the link in the event agenda / Slack channel. After the event, export the best clips and give marketing a ready-to-go content folder.` },
        { title: "Conference session playbook",      desc: `Place a QR slide at the end of each talk. Attendees upload audience photos and short clips; you build a sponsor-ready highlight set fast.` },
        { title: "Birthday party playbook",          desc: `Put the QR on a sign near the entrance and in the WhatsApp invite. Guests upload during the night; you wake up with everything in one place.` },
    ];

    return (
        <div className="min-h-screen" style={{ color: C.text }}>
            <Glow />
            <Header />

            {/* Hero */}
            <section className="pt-24 pb-4 lg:pt-28 lg:pb-10" style={{ position: "relative", zIndex: 1 }}>
                <Container>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "24px" }}>
                        {["Weddings", "Corporate", "Conferences", "Parties", "Community"].map(t => (
                            <span key={t} style={{ border: `1px solid ${C.border}`, color: C.accent, background: C.accentBg, fontFamily: C.mono, fontSize: "11px", borderRadius: "999px", padding: "4px 12px", letterSpacing: "0.04em" }}>{t}</span>
                        ))}
                    </div>
                    <h1 style={{ fontFamily: C.display, fontSize: "clamp(34px,4.5vw,58px)", fontWeight: 900, lineHeight: 1.06, letterSpacing: "-0.02em", color: C.text, maxWidth: "700px" }}>
                        Made for any event,<br />
                        <em style={{ fontStyle: "italic", color: C.accent }}>any size.</em>
                    </h1>
                    <p style={{ color: C.muted, fontSize: "17px", lineHeight: 1.75, marginTop: "20px", maxWidth: "560px" }}>
                        Stashed is designed for events with lots of guests and lots of moments.
                        It works anywhere you need a simple upload flow, a clean gallery, and organiser control.
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
                            href="/how-it-works"
                            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", border: `1px solid #e4e4e7`, color: C.muted, fontFamily: C.sans, fontSize: "14px", borderRadius: "10px", padding: "13px 22px", textDecoration: "none", background: "#fff", transition: "all 0.2s" }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.text; e.currentTarget.style.background = C.accentBg; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = "#e4e4e7"; e.currentTarget.style.color = C.muted; e.currentTarget.style.background = "#fff"; }}
                        >
                            How it works
                        </a>
                    </div>
                </Container>
            </section>

            <Divider />

            {/* Why people use it */}
            <section className="py-16" style={{ position: "relative", zIndex: 1 }}>
                <Container>
                    <SectionLabel>Why Stashed</SectionLabel>
                    <SectionHeading>
                        Why organisers<br />
                        <em style={{ fontStyle: "italic", color: C.muted }}>choose Stashed.</em>
                    </SectionHeading>
                    <div className="grid gap-4 md:grid-cols-2">
                        {whyPeopleUseIt.map((c, i) => <MiniCard key={i} title={c.title} desc={c.desc} />)}
                    </div>
                </Container>
            </section>

            <Divider />

            {/* Use case grid */}
            <section className="py-16" style={{ position: "relative", zIndex: 1 }}>
                <Container>
                    <SectionLabel>Use cases</SectionLabel>
                    <SectionHeading>
                        Choose your scenario.<br />
                        <em style={{ fontStyle: "italic", color: C.muted }}>The workflow stays the same.</em>
                    </SectionHeading>
                    <div className="grid gap-4 md:grid-cols-2">
                        {useCases.map((u, i) => <Card key={i} title={u.title} desc={u.desc} bullets={u.bullets} />)}
                    </div>
                </Container>
            </section>

            <Divider />

            {/* Playbooks */}
            <section className="py-16" style={{ position: "relative", zIndex: 1 }}>
                <Container>
                    <SectionLabel>Playbooks</SectionLabel>
                    <SectionHeading>
                        Quick guides for<br />
                        <em style={{ fontStyle: "italic", color: C.muted }}>maximum participation.</em>
                    </SectionHeading>
                    <div className="grid gap-4 md:grid-cols-2">
                        {playbooks.map((p, i) => <Card key={i} title={p.title} desc={p.desc} />)}
                    </div>
                </Container>
            </section>

            <Divider />

            {/* Comparison */}
            <section className="py-16" style={{ position: "relative", zIndex: 1 }}>
                <Container>
                    <SectionLabel>Comparison</SectionLabel>
                    <SectionHeading>
                        Stashed vs<br />
                        <em style={{ fontStyle: "italic", color: C.muted }}>common alternatives.</em>
                    </SectionHeading>
                    <div className="grid gap-4 md:grid-cols-3">
                        {comparison.map((c, i) => <Card key={i} title={c.title} desc={c.desc} bullets={c.bullets} />)}
                    </div>
                    <p style={{ fontFamily: C.mono, color: C.dim, fontSize: "12px", marginTop: "20px", letterSpacing: "0.02em" }}>
                        Stashed is designed to maximise participation (no logins) while keeping organisers in control (review & download).
                    </p>
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
                                Want Stashed<br />
                                <em style={{ fontStyle: "italic", color: C.accent }}>for your event?</em>
                            </h2>
                            <p style={{ color: C.muted, fontSize: "16px", lineHeight: 1.75, marginTop: "16px", maxWidth: "400px", margin: "16px auto 0" }}>
                                Get early access and be one of the first to use Stashed for weddings, corporate events, parties, and beyond.
                            </p>
                            <div style={{ marginTop: "32px", display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center" }}>
                                <a
                                    href="/signup"
                                    style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", background: C.accent, color: "#fff", fontFamily: C.sans, fontWeight: 700, fontSize: "15px", borderRadius: "12px", padding: "14px 32px", textDecoration: "none", transition: "background 0.2s" }}
                                    onMouseEnter={e => (e.currentTarget.style.background = C.accentHover)}
                                    onMouseLeave={e => (e.currentTarget.style.background = C.accent)}
                                >
                                    Get Started →
                                </a>
                                <a
                                    href="/features"
                                    style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", border: `1px solid #e4e4e7`, color: C.muted, fontFamily: C.sans, fontSize: "15px", borderRadius: "12px", padding: "14px 28px", textDecoration: "none", background: "#fff", transition: "all 0.2s" }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.text; e.currentTarget.style.background = C.accentBg; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#e4e4e7"; e.currentTarget.style.color = C.muted; e.currentTarget.style.background = "#fff"; }}
                                >
                                    Explore features
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
