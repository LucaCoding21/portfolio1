import { createHash, randomUUID } from "node:crypto";

/**
 * Meta's Conversions API (Oct 25 2026): the server tells Meta about each free
 * sample lead itself, beside the browser pixel (layout.tsx, pixel() in
 * lib/track), so a lead whose browser blocks the pixel still counts, and
 * Meta can match each lead to the ad that brought it. Lead for every first
 * send, SubmitApplication too when the revenue answer is $100K a year or
 * more (the event the campaigns optimize for). The browser and the server
 * send the same event_id, so Meta counts a lead once when both get through.
 *
 * Email and phone go only as SHA-256 hashes, which Meta matches against its
 * own records but can't read back; the privacy page says so. Quiet without
 * META_CAPI_TOKEN (Events Manager, the pixel's Settings, Conversions API),
 * and a failed send never fails the lead. META_CAPI_TEST_CODE, set only
 * while testing, sends to Events Manager's Test events tab instead of the
 * real numbers.
 */

export const META_PIXEL_ID = "2627321397702969";
const EVENTS_API = `https://graph.facebook.com/v26.0/${META_PIXEL_ID}/events`;
const FREE_PAGE = "https://cloverfield.studio/free-homepage-design";

const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");

/** An id the quiz made for this lead, else a fresh one (no pairing with the browser then). */
export function leadEventId(raw: unknown) {
  return typeof raw === "string" && /^[\w-]{8,64}$/.test(raw) ? raw : randomUUID();
}

/** Meta wants digits with the country code; ten digits is a North American number. */
function phoneDigits(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10 ? `1${digits}` : digits;
}

function cookie(header: string | null, name: string) {
  return header?.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`))?.[1];
}

export async function sendMetaLead(
  headers: Headers,
  lead: { eventId: string; qualified: boolean; email: string; phone: string }
) {
  const token = process.env.META_CAPI_TOKEN;
  if (!token) return;

  // The quiz posts from the free page, so the referer is that page, with the
  // ad's click id (fbclid) when the visitor came from an ad. The pixel keeps
  // that id in its _fbc cookie; when the pixel was blocked there's no
  // cookie, so it's built from the page's address instead.
  const page = headers.get("referer") ?? FREE_PAGE;
  const cookies = headers.get("cookie");
  let fbclid: string | null = null;
  try {
    fbclid = new URL(page).searchParams.get("fbclid");
  } catch {}
  const fbc = cookie(cookies, "_fbc") ?? (fbclid ? `fb.1.${Date.now()}.${fbclid}` : undefined);

  const userData = {
    em: [sha256(lead.email.trim().toLowerCase())],
    ph: [sha256(phoneDigits(lead.phone))],
    client_ip_address: headers.get("x-real-ip") ?? headers.get("x-forwarded-for")?.split(",")[0].trim(),
    client_user_agent: headers.get("user-agent") ?? undefined,
    fbp: cookie(cookies, "_fbp"),
    fbc,
  };
  const eventTime = Math.floor(Date.now() / 1000);
  const event = (name: "Lead" | "SubmitApplication") => ({
    event_name: name,
    event_time: eventTime,
    event_id: lead.eventId,
    action_source: "website",
    event_source_url: page,
    user_data: userData,
  });
  const data = lead.qualified ? [event("Lead"), event("SubmitApplication")] : [event("Lead")];

  try {
    const res = await fetch(EVENTS_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data,
        access_token: token,
        ...(process.env.META_CAPI_TEST_CODE ? { test_event_code: process.env.META_CAPI_TEST_CODE } : {}),
      }),
    });
    if (!res.ok) console.error("sendMetaLead: not sent:", res.status, await res.text());
  } catch (err) {
    console.error("sendMetaLead: not sent:", err);
  }
}
