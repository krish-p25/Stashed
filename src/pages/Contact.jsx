import { useState } from "react";
import Header from "../components/Header";
import Glow from "../components/Glow";

function Container({ children }) {
    return <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">{children}</div>;
}

function Card({ title, desc, children }) {
    return (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-semibold">{title}</h2>
            {desc ? <p className="mt-2 text-sm text-white/70">{desc}</p> : null}
            {children ? <div className="mt-6">{children}</div> : null}
        </div>
    );
}

function MiniCard({ title, desc }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm font-semibold">{title}</div>
            <div className="mt-2 text-sm leading-6 text-white/70">{desc}</div>
        </div>
    );
}

export default function Contact() {
    const [status, setStatus] = useState("idle"); // idle | sending | sent | error

    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            <Glow />
            <Header />

            {/* Hero */}
            <section className="pt-14 pb-12">
                <Container>
                    <h1 className="text-4xl font-semibold tracking-tight">Contact</h1>
                    <p className="mt-4 max-w-2xl text-lg text-white/70">
                        Want early access, have a question, or planning an event? Send a message and we’ll get back to you.
                    </p>
                </Container>
            </section>

            {/* Main */}
            <section className="pb-16">
                <Container>
                    <div className="grid gap-6 lg:grid-cols-12">
                        {/* Form */}
                        <div className="lg:col-span-7">
                            <Card
                                title="Send a message"
                                desc="Fill this in and we’ll reply by email. (We’ll wire this to the backend later.)"
                            >
                                <form
                                    className="grid gap-4"
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        setStatus("sending");

                                        // Placeholder: wire to API later
                                        setTimeout(() => setStatus("sent"), 600);
                                    }}
                                >
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="text-sm text-white/70">Name</label>
                                            <input
                                                required
                                                type="text"
                                                placeholder="Your name"
                                                className="mt-2 w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/20"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-sm text-white/70">Email</label>
                                            <input
                                                required
                                                type="email"
                                                placeholder="you@company.com"
                                                className="mt-2 w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/20"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="text-sm text-white/70">Event type (optional)</label>
                                            <input
                                                type="text"
                                                placeholder="Wedding, corporate event, party..."
                                                className="mt-2 w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/20"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-sm text-white/70">Attendees (optional)</label>
                                            <input
                                                type="number"
                                                min="1"
                                                placeholder="e.g. 120"
                                                className="mt-2 w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/20"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm text-white/70">Message</label>
                                        <textarea
                                            required
                                            rows={5}
                                            placeholder="Tell us what you’re planning, and what you need."
                                            className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/20"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="text-xs text-white/50">
                                            By sending this, you agree we can contact you about Stashed.
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={status === "sending" || status === "sent"}
                                            className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-zinc-950 hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {status === "sent" ? "Sent" : status === "sending" ? "Sending..." : "Send message"}
                                        </button>
                                    </div>

                                    {status === "sent" ? (
                                        <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
                                            Thanks — message received. We’ll reply soon.
                                        </div>
                                    ) : null}
                                </form>
                            </Card>
                        </div>

                        {/* Side info */}
                        <div className="lg:col-span-5">
                            <div className="grid gap-6">
                                <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
                                    <div className="text-sm font-semibold">Email</div>
                                    <div className="mt-2 text-sm text-white/70">
                                        Prefer email? Reach us at:
                                    </div>
                                    <div className="mt-3 text-sm">
                                        <span className="text-white/60">stashed@krishrp.xyz</span>
                                    </div>

                                    <div className="mt-6 text-sm font-semibold">Response time</div>
                                    <div className="mt-2 text-sm text-white/70">
                                        Usually within 24–48 hours.
                                    </div>
                                </div>

                                <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
                                    <div className="text-sm font-semibold">Early access</div>
                                    <p className="mt-2 text-sm text-white/70">
                                        If you’re organising an event soon, join the early access list and we’ll prioritise your use case.
                                    </p>
                                    <div className="mt-6">
                                        <a
                                            href="/#contact"
                                            className="inline-flex w-full items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-zinc-950 hover:bg-white/90"
                                        >
                                            Get early access
                                        </a>
                                    </div>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                                    <MiniCard
                                        title="Weddings"
                                        desc="Collect guest moments without chasing uploads after the day."
                                    />
                                    <MiniCard
                                        title="Corporate events"
                                        desc="Centralise content for recaps and marketing with organiser control."
                                    />
                                    <MiniCard
                                        title="Conferences"
                                        desc="Capture attendee content and speaker highlights in one place."
                                    />
                                    <MiniCard
                                        title="Parties"
                                        desc="One link everyone can use—no more lost photos across chats."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FAQ */}
                    <div className="mt-12">
                        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
                            <h2 className="text-2xl font-semibold">Quick FAQs</h2>
                            <div className="mt-6 grid gap-4 md:grid-cols-2">
                                <MiniCard
                                    title="Do guests need an account?"
                                    desc="No. Guests upload via a link or QR code with no sign-up required."
                                />
                                <MiniCard
                                    title="Can I keep the gallery private?"
                                    desc="Yes. Events are accessible by link/QR, and you can add a PIN later."
                                />
                                <MiniCard
                                    title="Can I download everything?"
                                    desc="Yes. Organisers can download all uploads (zip/batch export planned)."
                                />
                                <MiniCard
                                    title="Can I approve uploads before they show?"
                                    desc="Yes. Moderation is supported (optional) so you stay in control."
                                />
                            </div>
                        </div>
                    </div>
                </Container>
            </section>
        </div>
    );
}
