import { useEffect } from "react";

const BASE_URL = "https://stashed.krishrp.xyz";

function setMeta(name, content, attr = "name") {
    if (!content) return;
    let el = document.querySelector(`meta[${attr}="${name}"]`);
    if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
    }
    el.setAttribute("content", content);
}

function setLink(rel, href) {
    if (!href) return;
    let el = document.querySelector(`link[rel="${rel}"]`);
    if (!el) {
        el = document.createElement("link");
        el.setAttribute("rel", rel);
        document.head.appendChild(el);
    }
    el.setAttribute("href", href);
}

/**
 * useSEO — lightweight per-page meta/title manager (no external library)
 *
 * @param {object} opts
 * @param {string}   opts.title        — page <title> (without brand suffix)
 * @param {string}   opts.description  — meta description (≤ 160 chars)
 * @param {string}   [opts.canonical]  — canonical path, e.g. "/features"
 * @param {string}   [opts.ogImage]    — absolute OG image URL
 * @param {string}   [opts.ogType]     — og:type (default "website")
 * @param {object}   [opts.jsonLd]     — JSON-LD object to inject as <script>
 */
export function useSEO({ title, description, canonical, ogImage, ogType = "website", jsonLd } = {}) {
    useEffect(() => {
        const suffix = "Stashed";
        const fullTitle = title ? `${title} | ${suffix}` : `${suffix} — Shared Photo Album & Event Media Collection`;

        // Title
        document.title = fullTitle;

        // Description
        if (description) {
            setMeta("description", description);
            setMeta("og:description", description, "property");
            setMeta("twitter:description", description);
        }

        // OG title / twitter title
        setMeta("og:title", fullTitle, "property");
        setMeta("twitter:title", fullTitle);

        // OG type
        setMeta("og:type", ogType, "property");

        // Canonical + OG URL
        if (canonical) {
            const url = `${BASE_URL}${canonical}`;
            setLink("canonical", url);
            setMeta("og:url", url, "property");
        }

        // OG image
        if (ogImage) {
            setMeta("og:image", ogImage, "property");
            setMeta("twitter:image", ogImage);
        }

        // JSON-LD
        let ldScript = null;
        if (jsonLd) {
            ldScript = document.createElement("script");
            ldScript.type = "application/ld+json";
            ldScript.id   = "__page_jsonld__";
            // Remove any previous page-level JSON-LD
            document.querySelector("#__page_jsonld__")?.remove();
            ldScript.textContent = JSON.stringify(jsonLd);
            document.head.appendChild(ldScript);
        }

        return () => {
            // Restore defaults on unmount
            document.title = "Stashed — Collect Event Photos & Videos | Shared Photo Album App";
            document.querySelector("#__page_jsonld__")?.remove();
        };
    }, [title, description, canonical, ogImage, ogType]);
}
