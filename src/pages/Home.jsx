import { useCallback, useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Glow from "../components/Glow";

function Container({ children }) {
    return <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">{children}</div>;
}

function Pill({ children }) {
    return (
        <span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs text-violet-700">
            {children}
        </span>
    );
}

function Card({ title, desc }) {
    return (
        <div className="rounded-2xl border border-violet-200/70 bg-white p-6 shadow-sm hover:border-violet-300 hover:shadow-md hover:shadow-violet-100/50 transition-all duration-200">
            <h3 className="text-base font-semibold text-zinc-900">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-700">{desc}</p>
        </div>
    );
}

function ReviewsScroller() {
    const scrollerRef = useRef(null);
    const [showHint, setShowHint] = useState(false);
    const hideTimerRef = useRef(null);

    const isMobile = () => window.matchMedia("(max-width: 767px)").matches;

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

        const raf = requestAnimationFrame(updateHint);

        const onScroll = () => {
            setShowHint(false);
            if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
            hideTimerRef.current = setTimeout(() => { updateHint(); }, 160);
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
            quote: "We used Stashed at our wedding and it was a game-changer. Everyone uploaded instantly and we had everything in one place the next day.",
            name: "Sarah & Tom",
            meta: "Wedding, London",
        },
        {
            quote: "Perfect for corporate events. No chasing people for photos — the QR code did all the work.",
            name: "Mahesh Patel",
            meta: "Event Manager",
        },
        {
            quote: "Clean, simple, and exactly what guests want. We now use Stashed for every client event.",
            name: "Amelia Rhodes",
            meta: "Wedding Planner",
        },
        {
            quote: "The gallery felt premium and the admin controls were simple. Clients love the after-event download.",
            name: "Maya S.",
            meta: "Event Coordinator",
        },
        {
            quote: "Guests actually used it. That's the biggest win — no app installs and no friction.",
            name: "Ollie K.",
            meta: "Birthday Host",
        },
        {
            quote: "We printed the QR codes for tables and the uploads just flowed in. Brilliant for candid moments.",
            name: "Hannah & Imran",
            meta: "Wedding, Manchester",
        },
        {
            quote: "For conferences, it's a great way to collect attendee content and speaker highlights in one place.",
            name: "Daniel W.",
            meta: "Conference Organiser",
        },
    ];

    return (
        <div className="mt-8">
            <div className="relative">
                <div
                    ref={scrollerRef}
                    className="
                        max-h-[420px] overflow-y-auto pr-1 scrollbar-violet
                        md:max-h-none md:overflow-y-hidden md:overflow-x-auto md:pr-0 md:pb-2
                        scroll-smooth
                    "
                >
                    <div className="flex flex-col gap-4 md:flex-row md:gap-4 md:pb-2">
                        {reviews.map((r, idx) => (
                            <div
                                key={idx}
                                className="rounded-2xl border border-violet-100 bg-white p-6 shadow-sm md:min-w-[360px] md:max-w-[360px]"
                            >
                                <p className="text-sm leading-6 text-zinc-700">"{r.quote}"</p>
                                <div className="mt-4 text-sm font-semibold text-zinc-900">{r.name}</div>
                                <div className="text-xs text-zinc-500">{r.meta}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div
                    className={`pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 md:block transition-opacity duration-300 ${showHint ? "opacity-100" : "opacity-0"}`}
                >
                    <div className="flex items-center gap-2 rounded-full border border-violet-200 bg-white/90 px-3 py-2 shadow-sm backdrop-blur-sm">
                        <span className="text-xs text-zinc-600">Scroll</span>
                        <span className="animate-bounce-x text-violet-600">→</span>
                    </div>
                </div>
                <div
                    className={`pointer-events-none absolute bottom-2 left-1/2 block -translate-x-1/2 md:hidden transition-opacity duration-300 ${showHint ? "opacity-100" : "opacity-0"}`}
                >
                    <div className="flex items-center gap-2 rounded-full border border-violet-200 bg-white/90 px-3 py-2 shadow-sm backdrop-blur-sm">
                        <span className="text-xs text-zinc-600">Scroll</span>
                        <span className="animate-bounce text-violet-600">↓</span>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default function Home() {
    return (
        <div className="min-h-screen text-zinc-900">
            <Glow />
            <Header />

            <main className="relative">
                {/* Hero */}
                <section className="pt-24 pb-16 sm:pt-28">
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

                                <p className="mt-4 text-base leading-7 text-zinc-700 sm:text-lg">
                                    Stashed gives you a simple event page. Share a QR code or link, guests upload instantly, and you can
                                    review and download everything after.
                                </p>

                                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                                    <a
                                        href="contact"
                                        className="inline-flex items-center justify-center rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-700 transition-colors"
                                    >
                                        Get early access
                                    </a>
                                    <a
                                        href="how-it-works"
                                        className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
                                    >
                                        See how it works
                                    </a>
                                </div>

                                <div className="mt-6 text-xs text-zinc-500">
                                    Built for weddings, parties, corporate events, conferences, and organisers managing multiple events.
                                </div>
                            </div>

                            {/* Mock preview */}
                            <div className="rounded-3xl border border-violet-200/70 bg-white p-6 shadow-md shadow-violet-100/40">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm font-semibold text-zinc-900">Event gallery preview</div>
                                    <span className="text-xs text-zinc-500">Live-style demo</span>
                                </div>

                                <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
                                    {Array.from({ length: 12 }).map((_, i) => (
                                        <div key={i} className="aspect-square rounded-2xl bg-violet-100" aria-hidden="true" />
                                    ))}
                                </div>

                                <div className="mt-5 flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-2xl bg-violet-100 shrink-0" />
                                    <div className="min-w-0">
                                        <div className="text-sm font-semibold text-zinc-900">Guests upload from their phone</div>
                                        <div className="text-xs text-zinc-500">QR → upload → appears in your dashboard</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Container>
                </section>

                {/* How it works */}
                <section id="how" className="py-10">
                    <Container>
                        <h2 className="text-2xl font-semibold">How it works</h2>
                        <p className="mt-2 text-sm text-zinc-600">
                            Keep it simple for guests. Keep it controlled for hosts.
                        </p>

                        <div className="mt-8 grid gap-4 md:grid-cols-3">
                            <Card title="1) Create an event"       desc="Make an event page in seconds. Set a name, optional PIN, and upload limits." />
                            <Card title="2) Share a QR code or link" desc="Print a QR for tables or share the link in WhatsApp. Guests don't need an app." />
                            <Card title="3) Review & download"     desc="Approve, hide, or feature uploads. Download everything after the event." />
                        </div>
                    </Container>
                </section>

                {/* Features */}
                <section id="features" className="py-10">
                    <Container>
                        <h2 className="text-2xl font-semibold">Features</h2>
                        <p className="mt-2 text-sm text-zinc-600">
                            Built for organisers who want a clean guest experience and full control.
                        </p>

                        <div className="mt-8 grid gap-4 md:grid-cols-2">
                            <Card title="Guest-first uploads"   desc="Mobile-friendly uploader, simple flow, and fast uploads. No sign-ups." />
                            <Card title="Moderation controls"   desc="Approve uploads before they appear in a public gallery (optional)." />
                            <Card title="After-event downloads" desc="Export everything at once (zip), or download in batches." />
                            <Card title="Planner-ready"         desc="Run multiple events, keep things organised, and share clean galleries with clients." />
                        </div>
                    </Container>
                </section>

                {/* Reviews */}
                <section id="reviews" className="py-10">
                    <Container>
                        <h2 className="text-2xl font-semibold">What organisers say</h2>
                        <p className="mt-2 text-sm text-zinc-600">
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
                            <div className="rounded-2xl border border-violet-200/70 bg-white p-5 shadow-sm hover:border-violet-300 hover:shadow-md hover:shadow-violet-100/50 transition-all duration-200">
                                <div className="text-sm font-semibold text-zinc-900">Weddings</div>
                                <div className="mt-2 text-sm text-zinc-700">Collect guest moments without chasing uploads.</div>
                            </div>
                            <div className="rounded-2xl border border-violet-200/70 bg-white p-5 shadow-sm hover:border-violet-300 hover:shadow-md hover:shadow-violet-100/50 transition-all duration-200">
                                <div className="text-sm font-semibold text-zinc-900">Corporate events</div>
                                <div className="mt-2 text-sm text-zinc-700">Centralise media for internal recap + socials.</div>
                            </div>
                            <div className="rounded-2xl border border-violet-200/70 bg-white p-5 shadow-sm hover:border-violet-300 hover:shadow-md hover:shadow-violet-100/50 transition-all duration-200">
                                <div className="text-sm font-semibold text-zinc-900">Parties</div>
                                <div className="mt-2 text-sm text-zinc-700">One link everyone can use—no group chats needed.</div>
                            </div>
                            <div className="rounded-2xl border border-violet-200/70 bg-white p-5 shadow-sm hover:border-violet-300 hover:shadow-md hover:shadow-violet-100/50 transition-all duration-200">
                                <div className="text-sm font-semibold text-zinc-900">Conferences</div>
                                <div className="mt-2 text-sm text-zinc-700">Capture attendee uploads and speaker highlights.</div>
                            </div>
                        </div>
                    </Container>
                </section>

                {/* CTA */}
                <section className="py-16">
                    <Container>
                        <div className="rounded-3xl border border-violet-200/70 bg-violet-50/60 p-8 text-center shadow-sm">
                            <h2 className="text-2xl font-semibold text-zinc-900">Ready to try Stashed?</h2>
                            <p className="mt-2 text-sm text-zinc-700">
                                Get early access and be one of the first to use Stashed for your events.
                            </p>
                            <div className="mt-6">
                                <a
                                    href="/contact"
                                    className="inline-flex items-center justify-center rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white hover:bg-violet-700 transition-colors"
                                >
                                    Get early access
                                </a>
                            </div>
                        </div>
                    </Container>
                </section>

                <Footer />
            </main>
        </div>
    );
}
