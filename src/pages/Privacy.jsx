import Header from "../components/Header";
import Footer from "../components/Footer";
import Glow   from "../components/Glow";
import { useSEO } from "../hooks/useSEO";

function Container({ children }) {
    return <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">{children}</div>;
}

function Section({ title, children }) {
    return (
        <section className="space-y-3">
            <h2 className="text-lg font-semibold text-zinc-900">{title}</h2>
            <div className="space-y-2 text-sm leading-7 text-zinc-600">{children}</div>
        </section>
    );
}

export default function Privacy() {
    useSEO({
        title: "Privacy Policy — Stashed",
        description: "Read the Stashed privacy policy. How we handle data for event hosts and guests using our photo and video collection platform.",
        canonical: "/privacy",
    });
    return (
        <div className="min-h-screen text-zinc-900">
            <Glow />
            <Header />

            <main className="pt-24 pb-16 sm:pt-28">
                <Container>
                    <div className="rounded-2xl border border-violet-200/70 bg-white p-8 sm:p-10 shadow-sm">
                        <p className="text-sm text-zinc-500">Legal</p>
                        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">Privacy Policy</h1>
                        <p className="mt-2 text-sm text-zinc-500">Last updated: March 2025</p>

                        <div className="mt-8 space-y-8 divide-y divide-zinc-100">

                            <Section title="Who we are">
                                <p>
                                    Stashed is a media collection platform that allows event hosts to collect
                                    photos and videos from guests via a shareable link. We are operated by
                                    Krish Patel. If you have any questions about this policy, contact us at{" "}
                                    <a href="/contact" className="text-violet-600 hover:text-violet-700 transition-colors">
                                        our contact page
                                    </a>.
                                </p>
                            </Section>

                            <Section title="What data we collect">
                                <div className="pt-3">
                                    <p className="font-medium text-zinc-700">Account holders (event hosts)</p>
                                    <ul className="mt-2 list-disc list-inside space-y-1">
                                        <li>Email address and username, used to identify your account</li>
                                        <li>A hashed password — we never store your password in plain text</li>
                                        <li>A Google OAuth refresh token if you connect Google Drive, used solely to create and write to Drive folders on your behalf</li>
                                    </ul>
                                </div>
                                <div className="pt-2">
                                    <p className="font-medium text-zinc-700">Guests (uploaders)</p>
                                    <ul className="mt-2 list-disc list-inside space-y-1">
                                        <li>An optional display name you choose to provide at upload time</li>
                                        <li>The files you upload (photos, videos) and their metadata (file name, size, type)</li>
                                    </ul>
                                </div>
                            </Section>

                            <Section title="How we use your data">
                                <div className="pt-3 space-y-2">
                                    <p>We use the data we collect to:</p>
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>Authenticate event hosts and serve their dashboard</li>
                                        <li>Create a dedicated Google Drive folder and upload guest media into it on behalf of the event host</li>
                                        <li>Display uploaded media within the Stashed dashboard</li>
                                        <li>Respond to support enquiries sent via the contact form</li>
                                    </ul>
                                    <p>We do not sell your data, use it for advertising, or share it with third parties except as described in this policy.</p>
                                </div>
                            </Section>

                            <Section title="Google Drive integration">
                                <div className="pt-3 space-y-2">
                                    <p>
                                        When you connect Google Drive, Stashed requests the{" "}
                                        <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs font-mono text-zinc-700">
                                            drive.file
                                        </code>{" "}
                                        scope. This grants Stashed permission only to files and folders that
                                        Stashed itself creates — we cannot read, modify, or delete any other
                                        files in your Drive.
                                    </p>
                                    <p>
                                        Your Google refresh token is stored securely in our database and is used
                                        exclusively to create event folders and upload guest media into them. We
                                        do not access your Drive for any other purpose.
                                    </p>
                                    <p>
                                        You can revoke Stashed's access to your Google Drive at any time via{" "}
                                        <a
                                            href="https://myaccount.google.com/permissions"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-violet-600 hover:text-violet-700 transition-colors"
                                        >
                                            Google Account permissions
                                        </a>.
                                    </p>
                                </div>
                            </Section>

                            <Section title="Data retention">
                                <div className="pt-3 space-y-2">
                                    <p>
                                        Your account data is retained for as long as your account is active.
                                        Files uploaded by guests are stored in your connected Google Drive — we
                                        do not retain copies on our own servers beyond what is necessary to
                                        complete the upload.
                                    </p>
                                    <p>
                                        To request deletion of your account and associated data, contact us via{" "}
                                        <a href="/contact" className="text-violet-600 hover:text-violet-700 transition-colors">
                                            the contact page
                                        </a>.
                                    </p>
                                </div>
                            </Section>

                            <Section title="Cookies and tracking">
                                <div className="pt-3">
                                    <p>
                                        Stashed does not use cookies or any third-party analytics or tracking
                                        scripts. Authentication state is stored in your browser's{" "}
                                        <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs font-mono text-zinc-700">
                                            localStorage
                                        </code>{" "}
                                        and is never sent to third parties.
                                    </p>
                                </div>
                            </Section>

                            <Section title="Your rights">
                                <div className="pt-3 space-y-2">
                                    <p>You have the right to:</p>
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>Access the personal data we hold about you</li>
                                        <li>Request correction or deletion of your data</li>
                                        <li>Revoke Google Drive access at any time without deleting your account</li>
                                    </ul>
                                    <p>
                                        To exercise any of these rights, contact us via{" "}
                                        <a href="/contact" className="text-violet-600 hover:text-violet-700 transition-colors">
                                            the contact page
                                        </a>.
                                    </p>
                                </div>
                            </Section>

                            <Section title="Changes to this policy">
                                <div className="pt-3">
                                    <p>
                                        We may update this policy as the product evolves. The date at the top of
                                        this page reflects when it was last revised. Continued use of Stashed
                                        after changes constitutes acceptance of the updated policy.
                                    </p>
                                </div>
                            </Section>

                        </div>
                    </div>
                </Container>
            </main>
            <Footer />
        </div>
    );
}
