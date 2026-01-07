import { useCallback, useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import Glow from "../components/Glow";

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

function ReviewsScroller() {
    const scrollerRef = useRef(null);
    const [showHint, setShowHint] = useState(false);
    const hideTimerRef = useRef(null);

    const isMobile = () => window.matchMedia("(max-width: 767px)").matches; // < md

    const updateHint = useCallback(() => {
        const el = scrollerRef.current;
        if (!el) return;

        if (isMobile()) {
            const atEnd = Math.ceil(el.scrollTop + el.clientHeight) >= el.scrollHeight;
            setShowHint(!atEnd);
        } else {
            const atEnd = Math.ceil(el.scrollLeft + el.clientWidth) >= el.scrollWidth;
            setShowHint(!atEnd);
        }
    }, []);

    useEffect(() => {
        const el = scrollerRef.current;
        if (!el) return;

        // Initial check after layout
        const raf = requestAnimationFrame(updateHint);

        const onScroll = () => {
            // Hide immediately while scrolling
            setShowHint(false);

            // When scrolling stops, show again unless at end
            if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
            hideTimerRef.current = setTimeout(() => {
                updateHint();
            }, 160);
        };

        const onResize = () => updateHint();

        el.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onResize);

        return () => {
            cancelAnimationFrame(raf);
            el.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onResize);
            if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
        };
    }, [updateHint]);

    const reviews = [
        {
            quote:
                "We used Stashed at our wedding and it was a game-changer. Everyone uploaded instantly and we had everything in one place the next day.",
            name: "Sarah & Tom",
            meta: "Wedding, London",
        },
        {
            quote:
                "Perfect for corporate events. No chasing people for photos — the QR code did all the work.",
            name: "Mahesh Patel",
            meta: "Event Manager",
        },
        {
            quote:
                "Clean, simple, and exactly what guests want. We now use Stashed for every client event.",
            name: "Amelia Rhodes",
            meta: "Wedding Planner",
        },
        {
            quote:
                "The gallery felt premium and the admin controls were simple. Clients love the after-event download.",
            name: "Maya S.",
            meta: "Event Coordinator",
        },
        {
            quote:
                "Guests actually used it. That’s the biggest win — no app installs and no friction.",
            name: "Ollie K.",
            meta: "Birthday Host",
        },
        {
            quote:
                "We printed the QR codes for tables and the uploads just flowed in. Brilliant for candid moments.",
            name: "Hannah & Imran",
            meta: "Wedding, Manchester",
        },
        {
            quote:
                "For conferences, it’s a great way to collect attendee content and speaker highlights in one place.",
            name: "Daniel W.",
            meta: "Conference Organiser",
        },
    ];

    return (
        <div className="mt-8">
            {/* Relative wrapper so we can overlay the arrow */}
            <div className="relative">
                <div
                    ref={scrollerRef}
                    className="
            max-h-[420px] overflow-y-auto pr-1
            md:max-h-none md:overflow-y-hidden md:overflow-x-auto md:pr-0
            scroll-smooth
            md:scrollbar-hidden
          "
                >
                    <div className="flex flex-col gap-4 md:flex-row md:gap-4 md:pb-2">
                        {reviews.map((r, idx) => (
                            <div
                                key={idx}
                                className="
                  rounded-2xl border border-white/10 bg-white/5 p-6
                  md:min-w-[360px] md:max-w-[360px]
                "
                            >
                                <p className="text-sm leading-6 text-white/80">“{r.quote}”</p>
                                <div className="mt-4 text-sm font-semibold">{r.name}</div>
                                <div className="text-xs text-white/50">{r.meta}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bouncing scroll hint arrow (desktop: right, mobile: down) */}
                {showHint && (
                    <>
                        {/* Desktop (md+): right arrow */}
                        <div className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 md:block">
                            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-zinc-950/60 px-3 py-2 backdrop-blur">
                                <span className="text-xs text-white/70">Scroll</span>
                                <span className="animate-bounce-x text-white/80">→</span>
                            </div>
                        </div>

                        {/* Mobile: down arrow */}
                        <div className="pointer-events-none absolute bottom-2 left-1/2 block -translate-x-1/2 md:hidden">
                            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-zinc-950/60 px-3 py-2 backdrop-blur">
                                <span className="text-xs text-white/70">Scroll</span>
                                <span className="animate-bounce text-white/80">↓</span>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}


export default function Home() {

    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            {/* Top background glow */}
            <Glow />

            {/* Nav */}
            <Header />

            {/* Hero */}
            <main className="relative">
                <section className="pt-10 pb-16 sm:pt-14">
                    <Container>
                        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
                            <div>
                                <div className="flex flex-wrap gap-2">
                                    <Pill>No Apps</Pill>
                                    <Pill>No Logins</Pill>
                                    <Pill>QR or Link</Pill>
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
                                        href="contact"
                                        className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 hover:bg-white/90"
                                    >
                                        Get early access
                                    </a>
                                    <a
                                        href="how-it-works"
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
                <section id="how" className="py-10">
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
                <section id="features" className="py-10">
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

                {/* Reviews */}
                <section id="reviews" className="py-10">
                    <Container>
                        <h2 className="text-2xl font-semibold">What organisers say</h2>
                        <p className="mt-2 text-sm text-white/70">
                            Early feedback from planners and hosts using Stashed.
                        </p>

                        <ReviewsScroller />
                    </Container>
                </section>

                {/* Use cases */}
                <section id="use-cases" className="py-10">
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

                {/* CTA */}
                <section className="py-16">
                    <Container>
                        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
                            <h2 className="text-2xl font-semibold">Ready to try Stashed?</h2>
                            <p className="mt-2 text-sm text-white/70">
                                Get early access and be one of the first to use Stashed for your events.
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