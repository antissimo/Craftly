import { NextResponse } from "next/server";

type PayloadNavLink = {
  label?: unknown;
  url?: unknown;
  visible?: unknown;
  loggedInOnly?: unknown;
};

const fallbackLinks = [
  { href: "/", label: "Home", loggedInOnly: false },
  { href: "/explore?page=1", label: "Explore", loggedInOnly: false },
  { href: "/my-portfolio", label: "My Portfolio", loggedInOnly: true },
];

function normalizeLinks(raw: unknown) {
  if (!Array.isArray(raw)) return fallbackLinks;

  const links = raw
    .map((item) => item as PayloadNavLink)
    .filter((item) => typeof item.label === "string" && typeof item.url === "string")
    .filter((item) => item.visible !== false)
    .map((item) => ({
      href: item.url as string,
      label: item.label as string,
      loggedInOnly: item.loggedInOnly === true,
    }));

  return links.length > 0 ? links : fallbackLinks;
}

export async function GET() {
  const payloadBaseUrl = process.env.PAYLOAD_URL;

  if (!payloadBaseUrl) {
    return NextResponse.json({ links: fallbackLinks });
  }

  try {
    const response = await fetch(`${payloadBaseUrl}/api/globals/site-settings`, {
      next: { revalidate: 30 },
    });

    if (!response.ok) {
      return NextResponse.json({ links: fallbackLinks });
    }

    const data = await response.json();
    const links = normalizeLinks(data?.navbarLinks ?? data?.doc?.navbarLinks);

    return NextResponse.json({ links });
  } catch {
    return NextResponse.json({ links: fallbackLinks });
  }
}
