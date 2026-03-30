import { useRef, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Glow from "../components/Glow";
import { useSEO } from "../hooks/useSEO";

function Container({ children }) {
    return <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">{children}</div>;
}

function Card({ title, desc, children }) {
    return (
        <div className="rounded-3xl border border-violet-200/70 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-zinc-900">{title}</h2>
            {desc ? <p className="mt-2 text-sm text-zinc-600">{desc}</p> : null}
            {children ? <div className="mt-6">{children}</div> : null}
        </div>
    );
}

function MiniCard({ title, desc }) {
    return (
        <div className="rounded-2xl border border-violet-200/70 bg-white p-6 shadow-sm hover:border-violet-300 hover:shadow-md hover:shadow-violet-100/50 transition-all duration-200">
            <div className="text-sm font-semibold text-zinc-900">{title}</div>
            <div className="mt-2 text-sm leading-6 text-zinc-700">{desc}</div>
        </div>
    );
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
        <div className="min-h-screen text-zinc-900">
            <Glow />
            <Header />

            {/* Hero */}
            <section className="pt-24 pb-4 lg:pt-28 lg:pb-10">
                <Container>
                    <h1 className="text-4xl font-semibold tracking-tight">Contact</h1>
                    <p className="mt-4 max-w-full text-lg text-zinc-700">
                        Want early access, have a question, or planning an event? Send a message and we'll get back to you.
                    </p>
                </Container>
            </section>

            {/* Main */}
            <section className="pb-16">
                <Container>
                    <div className="grid gap-6 lg:grid-cols-12">
                        {/* Form */}
                        <div className="lg:col-span-7">
                            <Card title="Send a message" desc="Fill this in and we'll reply by email.">
                                <form
                                    className="grid gap-4"
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
                                            className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60 transition-colors"
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
                            </Card>
                        </div>

                        {/* Side info */}
                        <div className="lg:col-span-5">
                            <div className="grid gap-6">
                                <div className="rounded-3xl border border-violet-200/70 bg-white p-8 shadow-sm">
                                    <div className="text-sm font-semibold text-zinc-900">Email</div>
                                    <div className="mt-2 text-sm text-zinc-700">Prefer email? Reach us at:</div>
                                    <div className="mt-3 text-sm text-zinc-600">stashed@krishrp.xyz</div>

                                    <div className="mt-6 text-sm font-semibold text-zinc-900">Response time</div>
                                    <div className="mt-2 text-sm text-zinc-700">Usually within 24–48 hours.</div>
                                </div>

                                <div className="rounded-3xl border border-violet-200/70 bg-white p-8 shadow-sm">
                                    <div className="text-sm font-semibold text-zinc-900">Early access</div>
                                    <p className="mt-2 text-sm text-zinc-700">
                                        If you're organising an event soon, join the early access list and we'll prioritise your use case.
                                    </p>
                                    <div className="mt-6">
                                        <a
                                            href="/contact"
                                            className="inline-flex w-full items-center justify-center rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white hover:bg-violet-700 transition-colors"
                                        >
                                            Get early access
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FAQ */}
                    <div className="mt-12">
                        <div className="rounded-3xl border border-violet-200/70 bg-white p-8 shadow-sm">
                            <h2 className="text-2xl font-semibold text-zinc-900">Quick FAQs</h2>
                            <div className="mt-6 grid gap-4 md:grid-cols-2">
                                <MiniCard title="Do guests need an account?"         desc="No. Guests upload via a link or QR code with no sign-up required." />
                                <MiniCard title="Can I keep the gallery private?"    desc="Yes. Events are accessible by link/QR, and you can add a PIN later." />
                                <MiniCard title="Can I download everything?"         desc="Yes. Organisers can download all uploads (zip/batch export planned)." />
                                <MiniCard title="Can I approve uploads before they show?" desc="Yes. Moderation is supported (optional) so you stay in control." />
                            </div>
                        </div>
                    </div>
                </Container>
            </section>
            <Footer />
        </div>
    );
}
