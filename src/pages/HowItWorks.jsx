import Header from "../components/Header";
import Glow from "../components/Glow";

function Container({ children }) {
    return <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">{children}</div>;
}

function StepCard({ step, title, desc }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-sm font-semibold">
                    {step}
                </div>
                <h3 className="text-base font-semibold">{title}</h3>
            </div>
            <p className="mt-3 text-sm leading-6 text-white/70">{desc}</p>
        </div>
    );
}

function MiniCard({ title, desc }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-base font-semibold">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-white/70">{desc}</p>
        </div>
    );
}

export default function HowItWorks() {
    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            <Glow />
            <Header />

            {/* Hero */}
            <section className="py-4 lg:py-10">
                <Container>
                    <h1 className="text-4xl font-semibold tracking-tight">How Stashed works</h1>
                    <p className="mt-4 max-w-2xl text-lg text-white/70">
                        A simple flow for guests, with control for organisers. Set it up in minutes and collect
                        photos + videos from everyone.
                    </p>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                        <a
                            href="/contact"
                            className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-zinc-950 hover:bg-white/90"
                        >
                            Get early access
                        </a>
                        <a
                            href="/features"
                            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white/90 hover:bg-white/10"
                        >
                            View features
                        </a>
                    </div>
                </Container>
            </section>

            {/* Steps */}
            <section className="py-12">
                <Container>
                    <h2 className="text-2xl font-semibold">The 3-step flow</h2>
                    <p className="mt-2 text-sm text-white/70">
                        Guests shouldn’t need instructions. Organisers shouldn’t need spreadsheets.
                    </p>

                    <div className="mt-8 grid gap-4 md:grid-cols-3">
                        <StepCard
                            step="1"
                            title="Create an event"
                            desc="Name your event, set optional controls (PIN, upload limits), and generate a share link + QR code."
                        />
                        <StepCard
                            step="2"
                            title="Share the QR code or link"
                            desc="Print the QR for tables, add it to invites, or drop the link into WhatsApp. Guests open it instantly."
                        />
                        <StepCard
                            step="3"
                            title="Collect, review & download"
                            desc="Uploads arrive in one place. Download everything after the event and control visibility to your clients."
                        />
                    </div>
                </Container>
            </section>

            {/* Guest experience */}
            <section className="py-12">
                <Container>
                    <h2 className="text-2xl font-semibold">Guest experience</h2>

                    <div className="mt-8 grid gap-4 md:grid-cols-2">
                        <MiniCard
                            title="No apps, no logins"
                            desc="Guests just open the link and upload. Works great on iPhone/Android with a mobile-first UI."
                        />
                        <MiniCard
                            title="Fast uploads"
                            desc="Upload photos and short videos with a simple picker. Clear progress so guests know it worked."
                        />
                        <MiniCard
                            title="Optional PIN"
                            desc="Add a PIN to keep the event private while still keeping the guest flow friction-free."
                        />
                        <MiniCard
                            title="Clean gallery"
                            desc="Guests can browse what’s been shared (optional). Organisers decide what’s visible."
                        />
                    </div>
                </Container>
            </section>

            {/* Organiser controls */}
            <section className="py-12">
                <Container>
                    <h2 className="text-2xl font-semibold">Organiser controls</h2>

                    <div className="mt-8 grid gap-4 md:grid-cols-3">
                        <MiniCard
                            title="Moderation"
                            desc="Approve before public display, hide unwanted uploads, and feature your favourites."
                        />
                        <MiniCard
                            title="Downloads"
                            desc="Download everything as a zip, or export in batches for editing and sharing."
                        />
                        <MiniCard
                            title="Multiple events"
                            desc="Perfect for planners: keep each client and event neatly organised in one dashboard."
                        />
                    </div>
                </Container>
            </section>

            {/* CTA */}
            <section className="py-16">
                <Container>
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
                        <h2 className="text-2xl font-semibold">Want to use Stashed for your next event?</h2>
                        <p className="mt-2 text-sm text-white/70">
                            Leave your email and we’ll message you when the first version is ready.
                        </p>

                        <div className="mt-6">
                            <a
                                href="/contact"
                                className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-zinc-950 hover:bg-white/90"
                            >
                                Get early access
                            </a>
                        </div>
                    </div>
                </Container>
            </section>
        </div>
    );
}
