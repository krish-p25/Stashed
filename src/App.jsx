function Container({ children }) {
    return <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">{children}</div>;
}

function Pill({ children }) {
    return (
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
            {children}
        </span>
    );
}

function Card({ title, desc }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm">
            <h3 className="text-base font-semibold text-white">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-white/70">{desc}</p>
        </div>
    );
}

export default function App() {

    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            {/* Top background glow */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.25),transparent_55%)]" />

            {/* Nav */}
            <header className="relative">
                <Container>
                    <div className="flex flex-wrap items-center justify-between gap-4 py-6">
                        {/* Left: logo */}
                        <div className="flex items-center gap-3">
                            <img src="/logo_white.png" alt="Stashed" className="h-9 w-9" />
                            <div className="leading-tight">
                                <div className="font-semibold">Stashed</div>
                                <div className="text-xs text-white/60">Media Collection</div>
                            </div>
                        </div>

                        {/* Middle (mobile only): CTA shown when nav is on next line */}
                        <div className="flex items-center md:hidden">
                            <a
                                href="#contact"
                                className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-white/90"
                            >
                                Get early access
                            </a>
                        </div>

                        {/* Nav (wraps to next line on medium screens) */}
                        <nav
                            className="
        order-3 w-full
        flex flex-wrap items-center gap-x-6 gap-y-3
        text-sm text-white/70
        md:order-none md:w-auto md:justify-end
      "
                        >
                            <a className="hover:text-white" href="#how">How it works</a>
                            <a className="hover:text-white" href="#features">Features</a>
                            <a className="hover:text-white" href="#use-cases">Use cases</a>
                            <a className="hover:text-white" href="#contact">Contact</a>

                            {/* CTA (desktop only): hidden once it wraps */}
                            <a
                                href="#contact"
                                className="hidden md:inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-white/90"
                            >
                                Get early access
                            </a>
                        </nav>
                    </div>
                </Container>



            </header>

            {/* Hero */}
            <main className="relative">
                <section className="pt-10 pb-16 sm:pt-14">
                    <Container>
                        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
                            <div>
                                <div className="flex flex-wrap gap-2">
                                    <Pill>No apps</Pill>
                                    <Pill>No logins</Pill>
                                    <Pill>QR or link</Pill>
                                </div>

                                <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
                                    Collect event photos & videos in one place.
                                </h1>

                                <p className="mt-4 text-base leading-7 text-white/70 sm:text-lg">
                                    Stashed gives you a simple event page. Share a QR code or link, guests upload instantly, and you can
                                    review and download everything after.
                                </p>

                                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                                    <a
                                        href="#contact"
                                        className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 hover:bg-white/90"
                                    >
                                        Get early access
                                    </a>
                                    <a
                                        href="#how"
                                        className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white/90 hover:bg-white/10"
                                    >
                                        See how it works
                                    </a>
                                </div>

                                <div className="mt-6 text-xs text-white/50">
                                    Built for weddings, parties, corporate events, conferences, and organisers managing multiple events.
                                </div>
                            </div>

                            {/* Mock preview */}
                            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm font-semibold">Event gallery preview</div>
                                    <span className="text-xs text-white/60">Live-style demo</span>
                                </div>

                                <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
                                    {Array.from({ length: 12 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className="aspect-square rounded-2xl bg-white/10"
                                            aria-hidden="true"
                                        />
                                    ))}
                                </div>

                                <div className="mt-5 flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-2xl bg-white/10" />
                                    <div className="min-w-0">
                                        <div className="text-sm font-semibold">Guests upload from their phone</div>
                                        <div className="text-xs text-white/60">QR → upload → appears in your dashboard</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Container>
                </section>

                {/* How it works */}
                <section id="how" className="py-16">
                    <Container>
                        <div className="flex items-end justify-between gap-6">
                            <div>
                                <h2 className="text-2xl font-semibold">How it works</h2>
                                <p className="mt-2 text-sm text-white/70">
                                    Keep it simple for guests. Keep it controlled for hosts.
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 grid gap-4 md:grid-cols-3">
                            <Card
                                title="1) Create an event"
                                desc="Make an event page in seconds. Set a name, optional PIN, and upload limits."
                            />
                            <Card
                                title="2) Share a QR code or link"
                                desc="Print a QR for tables or share the link in WhatsApp. Guests don’t need an app."
                            />
                            <Card
                                title="3) Review & download"
                                desc="Approve, hide, or feature uploads. Download everything after the event."
                            />
                        </div>
                    </Container>
                </section>

                {/* Features */}
                <section id="features" className="py-16">
                    <Container>
                        <h2 className="text-2xl font-semibold">Features</h2>
                        <p className="mt-2 text-sm text-white/70">
                            Built for organisers who want a clean guest experience and full control.
                        </p>

                        <div className="mt-8 grid gap-4 md:grid-cols-2">
                            <Card
                                title="Guest-first uploads"
                                desc="Mobile-friendly uploader, simple flow, and fast uploads. No sign-ups."
                            />
                            <Card
                                title="Moderation controls"
                                desc="Approve uploads before they appear in a public gallery (optional)."
                            />
                            <Card
                                title="After-event downloads"
                                desc="Export everything at once (zip), or download in batches."
                            />
                            <Card
                                title="Planner-ready"
                                desc="Run multiple events, keep things organised, and share clean galleries with clients."
                            />
                        </div>
                    </Container>
                </section>

                {/* Use cases */}
                <section id="use-cases" className="py-16">
                    <Container>
                        <h2 className="text-2xl font-semibold">Use cases</h2>
                        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                                <div className="text-sm font-semibold">Weddings</div>
                                <div className="mt-2 text-sm text-white/70">Collect guest moments without chasing uploads.</div>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                                <div className="text-sm font-semibold">Corporate events</div>
                                <div className="mt-2 text-sm text-white/70">Centralise media for internal recap + socials.</div>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                                <div className="text-sm font-semibold">Parties</div>
                                <div className="mt-2 text-sm text-white/70">One link everyone can use—no group chats needed.</div>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                                <div className="text-sm font-semibold">Conferences</div>
                                <div className="mt-2 text-sm text-white/70">Capture attendee uploads and speaker highlights.</div>
                            </div>
                        </div>
                    </Container>
                </section>

                {/* Contact / CTA */}
                <section id="contact" className="py-16">
                    <Container>
                        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
                            <h2 className="text-2xl font-semibold">Get early access</h2>
                            <p className="mt-2 text-sm text-white/70">
                                Leave your email and we’ll message you when the first version is ready.
                            </p>

                            <form
                                className="mt-6 flex flex-col gap-3 sm:flex-row"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    alert("Nice — wire this to your backend later.");
                                }}
                            >
                                <input
                                    type="email"
                                    required
                                    placeholder="Email address"
                                    className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/20"
                                />
                                <button
                                    type="submit"
                                    className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 hover:bg-white/90"
                                >
                                    Notify me
                                </button>
                            </form>

                            <div className="mt-4 text-xs text-white/50">
                                Or email: <span className="text-white/70">stashed@krishrp.xyz</span>
                            </div>
                        </div>
                    </Container>
                </section>

                {/* Footer */}
                <footer className="border-t border-white/10 py-10">
                    <Container>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="text-sm text-white/60">© {new Date().getFullYear()} Stashed</div>
                            <div className="text-xs text-white/50">Media collection for events.</div>
                        </div>
                    </Container>
                </footer>
            </main>
        </div>
    );
}