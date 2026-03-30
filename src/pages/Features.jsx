import Header from "../components/Header";
import Footer from "../components/Footer";
import Glow from "../components/Glow";
import { useSEO } from "../hooks/useSEO";

function Container({ children }) {
    return <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">{children}</div>;
}

function FeatureCard({ title, desc }) {
    return (
        <div className="rounded-2xl border border-violet-200/70 bg-white p-6 shadow-sm hover:border-violet-300 hover:shadow-md hover:shadow-violet-100/50 transition-all duration-200">
            <h3 className="text-base font-semibold text-zinc-900">{title}</h3>
            <p className="mt-2 text-sm text-zinc-700 leading-6">{desc}</p>
        </div>
    );
}

export default function Features() {
    useSEO({
        title: "Features — Photo & Video Collection for Events",
        description: "QR code guest uploads, photo and video moderation, bulk downloads, Google Drive sync, PIN-protected galleries and more. Everything you need to collect event media in one shared photo album.",
        canonical: "/features",
        jsonLd: {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Stashed Features — Event Photo & Video Collection Platform",
            "description": "Full feature list for Stashed: QR code uploads, moderation, bulk downloads, Google Drive sync, multiple events management.",
            "url": "https://stashed.krishrp.xyz/features",
            "breadcrumb": {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://stashed.krishrp.xyz/" },
                    { "@type": "ListItem", "position": 2, "name": "Features", "item": "https://stashed.krishrp.xyz/features" }
                ]
            }
        }
    });

    return (
        <div className="min-h-screen text-zinc-900">
            <Glow />
            <Header />

            {/* Hero */}
            <section className="pt-24 pb-4 lg:pt-28 lg:pb-10">
                <Container>
                    <h1 className="text-4xl font-semibold tracking-tight">
                        Everything you need to collect event media
                    </h1>
                    <p className="mt-4 max-w-2xl text-lg text-zinc-700">
                        Stashed keeps uploads simple for guests and gives organisers full control —
                        without apps, logins, or messy group chats.
                    </p>
                </Container>
            </section>

            {/* Core features */}
            <section className="py-12">
                <Container>
                    <h2 className="text-2xl font-semibold">Core features</h2>
                    <div className="mt-8 grid gap-4 md:grid-cols-2">
                        <FeatureCard title="Instant guest uploads"    desc="Guests scan a QR code or open a link and upload straight from their phone. No apps, no accounts, no friction." />
                        <FeatureCard title="Private event galleries"  desc="Every event gets its own secure page so media stays organised and easy to share with clients or teams." />
                        <FeatureCard title="Moderation controls"      desc="Approve uploads before they appear, hide unwanted content, or feature your favourites." />
                        <FeatureCard title="After-event downloads"    desc="Download everything at once as a zip, or export in batches for editing and sharing." />
                    </div>
                </Container>
            </section>

            {/* Built for organisers */}
            <section className="py-12">
                <Container>
                    <h2 className="text-2xl font-semibold">Built for organisers</h2>
                    <div className="mt-8 grid gap-4 md:grid-cols-3">
                        <FeatureCard title="Run multiple events"     desc="Keep weddings, parties, and corporate events neatly separated in your dashboard." />
                        <FeatureCard title="Client-ready galleries"  desc="Share clean, branded galleries with couples, teams, or stakeholders." />
                        <FeatureCard title="Simple setup"            desc="Create an event in seconds and start collecting uploads immediately." />
                    </div>
                </Container>
            </section>

            {/* Privacy & security */}
            <section className="py-12">
                <Container>
                    <h2 className="text-2xl font-semibold">Privacy & security</h2>
                    <div className="mt-8 grid gap-4 md:grid-cols-2">
                        <FeatureCard title="Private by default"      desc="Events are only accessible to people with your link or QR code." />
                        <FeatureCard title="Data protection ready"   desc="Designed with GDPR in mind — no unnecessary personal data collected." />
                        <FeatureCard title="Control downloads"       desc="Decide who can download media and when." />
                        <FeatureCard title="Safe storage"            desc="Files are stored securely and delivered quickly to your guests." />
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
        </div>
    );
}
