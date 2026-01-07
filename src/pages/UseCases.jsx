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

function SectionTitle({ title, desc }) {
    return (
        <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold">{title}</h2>
            {desc ? <p className="text-sm text-white/70">{desc}</p> : null}
        </div>
    );
}

function Card({ title, desc, bullets }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-base font-semibold">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-white/70">{desc}</p>

            {bullets?.length ? (
                <ul className="mt-4 space-y-2 text-sm text-white/70">
                    {bullets.map((b) => (
                        <li className="flex items-start gap-2">
                            <span className="mt-2.25 h-1.5 w-1.5 shrink-0 rounded-full bg-white/40" />
                            <span className="leading-6">{b}</span>
                        </li>
                    ))}
                </ul>
            ) : null}
        </div>
    );
}

function MiniCard({ title, desc }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-sm font-semibold">{title}</div>
            <div className="mt-2 text-sm leading-6 text-white/70">{desc}</div>
        </div>
    );
}

function CTA({ title, desc }) {
    return (
        <section className="py-16">
            <Container>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
                    <h2 className="text-2xl font-semibold">{title}</h2>
                    <p className="mt-2 text-sm text-white/70">{desc}</p>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
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
                            Explore features
                        </a>
                    </div>
                </div>
            </Container>
        </section>
    );
}

export default function UseCases() {
    const useCases = [
        {
            title: "Weddings",
            desc:
                "Collect every guest moment without chasing people after the day. One link, one place, everything organised.",
            bullets: [
                "Print QR codes for tables, bar area, or photo booth",
                "Optional moderation so nothing awkward appears publicly",
                "Download everything for your photographer / editor after the event",
                "Perfect for candid, behind-the-scenes moments",
            ],
        },
        {
            title: "Wedding planners",
            desc:
                "Run multiple events with a consistent workflow. Keep media separated per client, and hand over a clean gallery after.",
            bullets: [
                "Separate events per client, no mixing media",
                "Share link/QR with venue staff and bridal party",
                "Client-ready downloads and tidy organisation",
                "Upsell as an add-on to your planning package",
            ],
        },
        {
            title: "Corporate events",
            desc:
                "Centralise attendee content for internal recaps, marketing, and employer branding — without relying on group chats.",
            bullets: [
                "Collect social-friendly content from attendees",
                "Keep everything in one folder-like gallery",
                "Optional approval flow before public display",
                "Useful for conferences, product launches, company socials",
            ],
        },
        {
            title: "Conferences & talks",
            desc:
                "Capture attendee uploads, speaker highlights, and behind-the-scenes clips across multiple rooms and sessions.",
            bullets: [
                "One QR per conference or per session (later: multi-QR)",
                "Collect audience angles of key moments",
                "Create a highlight set for sponsors and marketing",
                "Download all assets for recap content",
            ],
        },
        {
            title: "Parties & birthdays",
            desc:
                "Stop losing memories in 10 different chats. Guests upload in one place and you keep the best bits forever.",
            bullets: [
                "Ideal for big birthday parties and anniversaries",
                "Guests upload instantly (no reminders needed)",
                "Private link keeps it contained to your group",
                "Download everything after the night",
            ],
        },
        {
            title: "Festivals & ticketed events",
            desc:
                "Let attendees contribute content while you keep control. Great for community events and brand activations.",
            bullets: [
                "Collect UGC at scale with a simple flow",
                "Add moderation controls if you want a public gallery",
                "Build a recap library for socials and sponsors",
                "Works well for pop-ups, launches, and activations",
            ],
        },
        {
            title: "School & community events",
            desc:
                "Centralise photos from parents and volunteers with clear boundaries and privacy controls.",
            bullets: [
                "Share QR at the entrance or in newsletters",
                "Optional PIN to control access",
                "Keep media separated per event/date",
                "Download and share a final album with the community",
            ],
        },
        {
            title: "Sports teams & tournaments",
            desc:
                "Gather photos and clips from different viewpoints — players, parents, coaches — into one organised place.",
            bullets: [
                "One place for matchday photos/videos",
                "Collect highlights across multiple games",
                "Useful for clubs, academies, tournaments",
                "Easy downloads for editing and social posts",
            ],
        },
    ];

    const whyPeopleUseIt = [
        {
            title: "No app installs",
            desc: "Guests are far more likely to upload when it’s a link + picker. Reduce drop-off immediately.",
        },
        {
            title: "Everything in one place",
            desc: "Stop losing media across WhatsApp, iMessage, and random Drive links.",
        },
        {
            title: "Organiser control",
            desc: "Moderate uploads, feature favourites, and export clean downloads after the event.",
        },
        {
            title: "Works for big groups",
            desc: "Designed for events with lots of guests and lots of devices — without chaos.",
        },
    ];

    const comparison = [
        {
            title: "WhatsApp / iMessage",
            desc: "Fast but messy",
            bullets: [
                "Media compressed and hard to organise",
                "People forget to upload",
                "Multiple chats = lost content",
                "No moderation or approval controls",
            ],
        },
        {
            title: "Google Drive / Dropbox links",
            desc: "Organised but high friction",
            bullets: [
                "Guests often need accounts/logins",
                "Uploads on mobile are clunky",
                "People don’t know what folder to use",
                "Low participation without constant reminders",
            ],
        },
        {
            title: "Stashed",
            desc: "Low friction + organiser control",
            bullets: [
                "QR/link → instant upload",
                "No logins, no apps",
                "Optional moderation and downloads",
                "Clean gallery workflow for organisers",
            ],
        },
    ];

    const playbooks = [
        {
            title: "Wedding table QR playbook",
            desc:
                "Print a QR code for each table. Add a short line: “Upload your best photos from today.” You’ll get candid moments you’d never see otherwise.",
        },
        {
            title: "Corporate event recap playbook",
            desc:
                "Share the link in the event agenda / Slack channel. After the event, export the best clips and give marketing a ready-to-go content folder.",
        },
        {
            title: "Conference session playbook",
            desc:
                "Place a QR slide at the end of each talk. Attendees upload audience photos and short clips; you build a sponsor-ready highlight set fast.",
        },
        {
            title: "Birthday party playbook",
            desc:
                "Put the QR on a sign near the entrance and in the WhatsApp invite. Guests upload during the night; you wake up with everything in one place.",
        },
    ];

    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            <Glow />
            <Header />

            {/* Hero */}
            <section className="py-4 lg:py-10">
                <Container>
                    <div className="flex flex-wrap gap-2">
                        <Pill>Weddings</Pill>
                        <Pill>Corporate</Pill>
                        <Pill>Conferences</Pill>
                        <Pill>Parties</Pill>
                        <Pill>Community</Pill>
                    </div>

                    <h1 className="mt-5 text-4xl font-semibold tracking-tight">
                        Use cases for collecting event photos & videos
                    </h1>
                    <p className="mt-4 max-w-3xl text-lg text-white/70">
                        Stashed is designed for events with lots of guests and lots of moments.
                        It works anywhere you need a simple upload flow, a clean gallery, and organiser control.
                    </p>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                        <a
                            href="/contact"
                            className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-zinc-950 hover:bg-white/90"
                        >
                            Get early access
                        </a>
                        <a
                            href="/how-it-works"
                            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white/90 hover:bg-white/10"
                        >
                            How it works
                        </a>
                    </div>
                </Container>
            </section>

            {/* Why people use it */}
            <section className="py-12">
                <Container>
                    <SectionTitle
                        title="Why organisers choose Stashed"
                        desc="The most common reasons planners and hosts switch from chats and shared drives."
                    />
                    <div className="mt-8 grid gap-4 md:grid-cols-2">
                        {whyPeopleUseIt.map((c, i) => (
                            <MiniCard key={i} title={c.title} desc={c.desc} />
                        ))}
                    </div>
                </Container>
            </section>

            {/* Use case grid */}
            <section className="py-12">
                <Container>
                    <SectionTitle
                        title="Use cases"
                        desc="Choose your scenario — the workflow stays the same: share → collect → review → download."
                    />

                    <div className="mt-8 grid gap-4 md:grid-cols-2">
                        {useCases.map((u, i) => (
                            <Card key={i} title={u.title} desc={u.desc} bullets={u.bullets} />
                        ))}
                    </div>
                </Container>
            </section>

            {/* Playbooks */}
            <section className="py-12">
                <Container>
                    <SectionTitle
                        title="Quick playbooks"
                        desc="Simple ways to get the highest guest participation with almost zero effort."
                    />

                    <div className="mt-8 grid gap-4 md:grid-cols-2">
                        {playbooks.map((p, i) => (
                            <Card key={i} title={p.title} desc={p.desc} />
                        ))}
                    </div>
                </Container>
            </section>

            {/* Comparison */}
            <section className="py-12">
                <Container>
                    <SectionTitle
                        title="Stashed vs common alternatives"
                        desc="Most people start with WhatsApp or a Drive link. Here’s why those break down at scale."
                    />

                    <div className="mt-8 grid gap-4 md:grid-cols-3">
                        {comparison.map((c, i) => (
                            <Card key={i} title={c.title} desc={c.desc} bullets={c.bullets} />
                        ))}
                    </div>

                    <div className="mt-6 text-xs text-white/50">
                        Stashed is designed to maximise participation (no logins) while keeping organisers in control (review & download).
                    </div>
                </Container>
            </section>

            <CTA
                title="Want Stashed for your event?"
                desc="Get early access and be one of the first to use Stashed for weddings, corporate events, parties, and beyond."
            />
        </div>
    );
}
