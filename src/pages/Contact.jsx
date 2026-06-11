import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Glow from "../components/Glow";
import { useSEO } from "../hooks/useSEO";
import { C, cardHover, cardLeave } from "../lib/design";

function Container({ children }) {
    return <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">{children}</div>;
}

function SectionLabel({ children }) {
    return <div style={{ fontFamily: C.mono, color: C.accent, fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "12px" }}>{children}</div>;
}

const inputClass = "mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-500 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 transition-colors";

export default function Contact() {
    useSEO({
        title: "Contact — Get in Touch with Stashed",
        description: "Get in touch with the Stashed team. Questions about our shared photo album platform, event media collection, or partnership enquiries — we'd love to hear from you.",
        canonical: "/contact",
    });
    const [status, setStatus] = useState("idle");
    const [errorMsg, setErrorMsg] = useState("");

    return (
        <div className="min-h-screen" style={{ color: C.text }}>
            <Glow />
            <Header />

            {/* Hero */}
            <section className="pt-24 pb-4 lg:pt-28 lg:pb-10" style={{ position: "relative", zIndex: 1 }}>
                <Container>
                    <SectionLabel>Contact</SectionLabel>
                    <h1 style={{ fontFamily: C.display, fontSize: "clamp(34px,4.5vw,58px)", fontWeight: 900, lineHeight: 1.06, letterSpacing: "-0.02em", color: C.text }}>
                        Get in touch.
                    </h1>
                    <p style={{ color: C.muted, fontSize: "17px", lineHeight: 1.75, marginTop: "16px", maxWidth: "480px" }}>
                        Want early access, have a question, or planning an event? Send a message and we'll get back to you.
                    </p>
                </Container>
            </section>

            {/* Main */}
            <section className="pb-16" style={{ position: "relative", zIndex: 1 }}>
                <Container>
                    <div className="grid gap-6 lg:grid-cols-12">
                        {/* Form */}
                        <div className="lg:col-span-7">
                            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "20px", padding: "clamp(24px,4vw,40px)" }}>
                                <h2 style={{ fontFamily: C.display, fontSize: "22px", fontWeight: 700, color: C.text }}>Send a message</h2>
                                <p style={{ color: C.muted, fontSize: "14px", marginTop: "6px" }}>Fill this in and we'll reply by email.</p>
                                <form
                                    className="grid gap-4 mt-6"
                                    onSubmit={async (e) => {
                                        e.preventDefault();
                                        setStatus("sending");
                                        setErrorMsg("");
                                        const fd = new FormData(e.currentTarget);
                                        try {
                                            const res = await fetch("/api/contact", {
                                                method: "POST",
                                                headers: { "Content-Type": "application/json" },
                                                body: JSON.stringify({
                                                    name: fd.get("name"),
                                                    email: fd.get("email"),
                                                    eventType: fd.get("eventType"),
                                                    attendees: fd.get("attendees"),
                                                    message: fd.get("message"),
                                                }),
                                            });
                                            const data = await res.json();
                                            if (!res.ok || !data.ok) throw new Error(data.error || "Failed to send.");
                                            setStatus("sent");
                                        } catch (err) {
                                            setErrorMsg(err?.message || "Something went wrong. Please try again.");
                                            setStatus("idle");
                                        }
                                    }}
                                >
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="text-sm text-zinc-700">Name</label>
                                            <input required type="text" name="name" placeholder="Your name" className={inputClass} />
                                        </div>
                                        <div>
                                            <label className="text-sm text-zinc-700">Email</label>
                                            <input required type="email" name="email" placeholder="you@company.com" className={inputClass} />
                                        </div>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="text-sm text-zinc-700">Event type (optional)</label>
                                            <input type="text" name="eventType" placeholder="Wedding, corporate event, party..." className={inputClass} />
                                        </div>
                                        <div>
                                            <label className="text-sm text-zinc-700">Attendees (optional)</label>
                                            <input type="number" name="attendees" min="1" placeholder="e.g. 120" className={inputClass} />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm text-zinc-700">Message</label>
                                        <textarea
                                            required
                                            name="message"
                                            rows={5}
                                            placeholder="Tell us what you're planning, and what you need."
                                            className={`${inputClass} resize-none`}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="text-xs text-zinc-500">
                                            By sending this, you agree we can contact you about Stashed.
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={status === "sending" || status === "sent"}
                                            style={{ background: C.accent, transition: "background 0.2s" }}
                                            onMouseEnter={e => { if (!e.currentTarget.disabled) e.currentTarget.style.background = C.accentHover; }}
                                            onMouseLeave={e => (e.currentTarget.style.background = C.accent)}
                                            className="inline-flex cursor-pointer items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {status === "sent" ? "Message sent" : status === "sending" ? "Sending..." : "Send message"}
                                        </button>
                                    </div>

                                    {status === "sent" ? (
                                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                                            Thanks — message received. We'll reply soon.
                                        </div>
                                    ) : null}
                                    {errorMsg ? (
                                        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                                            {errorMsg}
                                        </div>
                                    ) : null}
                                </form>
                            </div>
                        </div>

                        {/* Side info */}
                        <div className="lg:col-span-5">
                            <div className="grid gap-4">
                                <div
                                    style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "20px", padding: "28px" }}
                                    onMouseEnter={e => cardHover(e.currentTarget)}
                                    onMouseLeave={e => cardLeave(e.currentTarget)}
                                >
                                    <div style={{ fontFamily: C.sans, fontWeight: 600, color: C.text, fontSize: "14px" }}>Email</div>
                                    <div style={{ color: C.muted, fontSize: "14px", marginTop: "6px" }}>Prefer email? Reach us at:</div>
                                    <div style={{ fontFamily: C.mono, color: C.accent, fontSize: "13px", marginTop: "10px", letterSpacing: "0.02em" }}>stashed@krishrp.xyz</div>
                                    <div style={{ fontFamily: C.sans, fontWeight: 600, color: C.text, fontSize: "14px", marginTop: "20px" }}>Response time</div>
                                    <div style={{ color: C.muted, fontSize: "14px", marginTop: "6px" }}>Usually within 24–48 hours.</div>
                                </div>

                                <div style={{ background: C.accentBg, border: `1px solid ${C.border}`, borderRadius: "20px", padding: "28px" }}>
                                    <div style={{ fontFamily: C.sans, fontWeight: 600, color: C.text, fontSize: "14px" }}>Early access</div>
                                    <p style={{ color: C.muted, fontSize: "14px", lineHeight: 1.7, marginTop: "8px" }}>
                                        If you're organising an event soon, join the early access list and we'll prioritise your use case.
                                    </p>
                                    <div style={{ marginTop: "20px" }}>
                                        <a
                                            href="/signup"
                                            style={{ display: "flex", alignItems: "center", justifyContent: "center", background: C.accent, color: "#fff", fontFamily: C.sans, fontWeight: 700, fontSize: "14px", borderRadius: "10px", padding: "12px 20px", textDecoration: "none", transition: "background 0.2s" }}
                                            onMouseEnter={e => (e.currentTarget.style.background = C.accentHover)}
                                            onMouseLeave={e => (e.currentTarget.style.background = C.accent)}
                                        >
                                            Get early access →
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FAQ */}
                    <div className="mt-10">
                        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "20px", padding: "clamp(24px,4vw,40px)" }}>
                            <h2 style={{ fontFamily: C.display, fontSize: "22px", fontWeight: 700, color: C.text, marginBottom: "24px" }}>Quick FAQs</h2>
                            <div className="grid gap-4 md:grid-cols-2">
                                {[
                                    { title: "Do guests need an account?",             desc: "No. Guests upload via a link or QR code with no sign-up required." },
                                    { title: "Can I keep the gallery private?",         desc: "Yes. Events are accessible by link/QR, and you can add a PIN later." },
                                    { title: "Can I download everything?",              desc: "Yes. Organisers can download all uploads (zip/batch export planned)." },
                                    { title: "Can I approve uploads before they show?", desc: "Yes. Moderation is supported (optional) so you stay in control." },
                                ].map(({ title, desc }) => (
                                    <div
                                        key={title}
                                        style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "20px", transition: "border-color 0.2s" }}
                                        onMouseEnter={e => (e.currentTarget.style.borderColor = C.borderHover)}
                                        onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}
                                    >
                                        <div style={{ fontFamily: C.sans, fontWeight: 600, color: C.text, fontSize: "14px" }}>{title}</div>
                                        <div style={{ color: C.muted, fontSize: "14px", lineHeight: 1.7, marginTop: "6px" }}>{desc}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Container>
            </section>
            <Footer />
        </div>
    );
}
