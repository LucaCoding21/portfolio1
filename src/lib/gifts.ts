import { randomBytes } from "node:crypto";
import { cache } from "react";
import { Timestamp, type DocumentData } from "firebase-admin/firestore";
import { Resend } from "resend";
import { firestore } from "@/lib/firebaseAdmin";
import { claimByFor, isEmail, type GiftStatus } from "@/lib/giftShared";

/**
 * Referral gifts, server side. The Firestore layout, shared with Command
 * Center (which adds the clients and shows the gifts):
 *
 *   referral_clients/{id}  first_name, business, site_url, email, token,
 *                          created_at, from_gift_id
 *   referral_gifts/{id}    client_id, friend_name, note, created_at, claim_by,
 *                          status (sent, claimed, signed), opened_at,
 *                          friend_full_name, friend_business, friend_contact,
 *                          friend_email, friend_site, claimed_at,
 *                          expiry_emailed_at, friend_client_id
 *
 * friend_name is the name the client wrote on the card and never changes;
 * friend_full_name is the name the friend gave when claiming. friend_contact
 * is their phone (Command Center shows it as Contact; before October 17 2026
 * it was "phone or email") and friend_email their email, if given.
 * friend_site, their current website, is no longer asked for (October 17
 * 2026) and stays null on new claims. opened_at is
 * the friend's first tap on the envelope. A client's email is optional: with
 * one, they hear when their gift is claimed or expires. A friend whose gift
 * is signed can pass it on: they become a client themselves (from_gift_id),
 * and the gift points at them (friend_client_id).
 *
 * A client's token is their private link (/g/<token>) and a gift's id is its
 * link (/gift/<id>). Both are random, so neither can be guessed.
 */

const CLIENTS = "referral_clients";
const GIFTS = "referral_gifts";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

/** Random base62. Bytes of 248 and up are skipped so every letter is equally likely. */
function randomId(length: number): string {
  let out = "";
  while (out.length < length) {
    for (const b of randomBytes(length * 2)) {
      if (b < 248 && out.length < length) out += ALPHABET[b % 62];
    }
  }
  return out;
}

export const newGiftId = () => randomId(12);

export interface GiftClient {
  id: string;
  firstName: string;
  business: string;
  siteUrl: string;
  /** Empty when Command Center has none for them. */
  email: string;
  token: string;
}

export interface Gift {
  id: string;
  client: GiftClient;
  friendName: string;
  note: string;
  claimBy: Date;
  status: GiftStatus;
  /** Past its claim date and never claimed. */
  expired: boolean;
}

function toClient(id: string, d: DocumentData): GiftClient {
  return {
    id,
    firstName: d.first_name ?? "",
    business: d.business ?? "",
    siteUrl: d.site_url ?? "",
    email: d.email ?? "",
    token: d.token ?? "",
  };
}

export const getClientByToken = cache(async (token: string): Promise<GiftClient | null> => {
  const snap = await firestore().collection(CLIENTS).where("token", "==", token).limit(1).get();
  const doc = snap.docs[0];
  return doc ? toClient(doc.id, doc.data()) : null;
});

export const getGift = cache(async (id: string): Promise<Gift | null> => {
  const db = firestore();
  const snap = await db.collection(GIFTS).doc(id).get();
  const g = snap.data();
  if (!g) return null;
  const clientSnap = await db.collection(CLIENTS).doc(g.client_id).get();
  if (!clientSnap.exists) return null;
  const claimBy = (g.claim_by as Timestamp).toDate();
  return {
    id,
    client: toClient(clientSnap.id, clientSnap.data()!),
    friendName: g.friend_name,
    note: g.note ?? "",
    claimBy,
    status: g.status,
    expired: g.status === "sent" && claimBy.getTime() < Date.now(),
  };
});

/** Saves a new gift under `id`. Throws if the id is taken (Firestore's create). */
export async function createGift(input: { id: string; clientId: string; friendName: string; note: string }) {
  const created = new Date();
  const claimBy = claimByFor(created);
  await firestore()
    .collection(GIFTS)
    .doc(input.id)
    .create({
      client_id: input.clientId,
      friend_name: input.friendName,
      note: input.note,
      created_at: Timestamp.fromDate(created),
      claim_by: Timestamp.fromDate(claimBy),
      status: "sent",
      opened_at: null,
      friend_full_name: null,
      friend_business: null,
      friend_contact: null,
      friend_email: null,
      friend_site: null,
      claimed_at: null,
      expiry_emailed_at: null,
    });
  return { claimBy };
}

/** How long after claiming a friend can still fix their details ("Wrong number? Fix it"). */
const FIX_WINDOW_MS = 60 * 60 * 1000;

export type ClaimResult = "ok" | "fixed" | "missing" | "claimed" | "expired";

export async function claimGift(
  id: string,
  friend: { name: string; business: string; phone: string; email: string },
  { fix = false } = {},
): Promise<ClaimResult> {
  const db = firestore();
  const ref = db.collection(GIFTS).doc(id);
  return db.runTransaction(async (tx) => {
    const g = (await tx.get(ref)).data();
    if (!g) return "missing";
    if (g.status !== "sent") {
      const claimedAt = (g.claimed_at as Timestamp | null)?.toMillis() ?? 0;
      if (!fix || g.status !== "claimed" || Date.now() - claimedAt > FIX_WINDOW_MS) return "claimed";
      tx.update(ref, {
        friend_full_name: friend.name,
        friend_business: friend.business,
        friend_contact: friend.phone,
        friend_email: friend.email || null,
      });
      return "fixed";
    }
    if ((g.claim_by as Timestamp).toMillis() < Date.now()) return "expired";
    // friend_name stays as the client wrote it: it's on the card.
    tx.update(ref, {
      status: "claimed",
      friend_full_name: friend.name,
      friend_business: friend.business,
      friend_contact: friend.phone,
      friend_email: friend.email || null,
      claimed_at: Timestamp.now(),
    });
    return "ok";
  });
}

/**
 * A friend whose gift is signed asks to send gifts of their own. The first
 * time, they become a referral client (in Command Center like any other,
 * with no site yet: William adds the one he built), and later asks get the
 * same link. Null when the gift isn't signed.
 */
export async function passOn(id: string): Promise<{ token: string; created: boolean; friendName: string } | null> {
  const db = firestore();
  const ref = db.collection(GIFTS).doc(id);
  return db.runTransaction(async (tx) => {
    const g = (await tx.get(ref)).data();
    if (!g || g.status !== "signed") return null;
    const friendName: string = g.friend_name;
    if (g.friend_client_id) {
      const c = (await tx.get(db.collection(CLIENTS).doc(g.friend_client_id))).data();
      if (c?.token) return { token: c.token, created: false, friendName };
    }
    // Older claims had one "phone or email" field.
    const email: string = g.friend_email ?? (isEmail(g.friend_contact ?? "") ? g.friend_contact : "");
    const clientRef = db.collection(CLIENTS).doc();
    const token = randomId(16);
    tx.create(clientRef, {
      first_name: friendName,
      business: g.friend_business ?? "",
      site_url: "",
      email: email.trim() || null,
      token,
      created_at: Timestamp.now(),
      from_gift_id: id,
    });
    tx.update(ref, { friend_client_id: clientRef.id });
    return { token, created: true, friendName };
  });
}

/** Records the friend's first tap on the envelope. Later taps change nothing. */
export async function markOpened(id: string): Promise<void> {
  const db = firestore();
  const ref = db.collection(GIFTS).doc(id);
  await db.runTransaction(async (tx) => {
    const g = (await tx.get(ref)).data();
    if (g && g.status === "sent" && !g.opened_at) tx.update(ref, { opened_at: Timestamp.now() });
  });
}

export interface ExpiredGift {
  friendName: string;
  createdAt: Date;
  claimBy: Date;
  client: GiftClient;
}

/**
 * Gifts that passed their claim-by date unclaimed and haven't been emailed
 * about yet. Each is marked as emailed before it's returned, so a rerun
 * never sends the same email twice. Filtered here rather than in the query,
 * which would need a composite index; open gifts are few.
 */
export async function takeNewlyExpired(): Promise<ExpiredGift[]> {
  const db = firestore();
  const snap = await db.collection(GIFTS).where("status", "==", "sent").get();
  const now = Date.now();
  const out: ExpiredGift[] = [];
  for (const doc of snap.docs) {
    const g = doc.data();
    if (g.expiry_emailed_at || (g.claim_by as Timestamp).toMillis() >= now) continue;
    const taken = await db.runTransaction(async (tx) => {
      const fresh = (await tx.get(doc.ref)).data();
      if (!fresh || fresh.status !== "sent" || fresh.expiry_emailed_at) return false;
      tx.update(doc.ref, { expiry_emailed_at: Timestamp.now() });
      return true;
    });
    if (!taken) continue;
    const clientSnap = await db.collection(CLIENTS).doc(g.client_id).get();
    if (!clientSnap.exists) continue;
    out.push({
      friendName: g.friend_name,
      createdAt: (g.created_at as Timestamp).toDate(),
      claimBy: (g.claim_by as Timestamp).toDate(),
      client: toClient(clientSnap.id, clientSnap.data()!),
    });
  }
  return out;
}

/** Sends a plain text email. A failed email is logged, never shown to the person. */
async function sendEmail(msg: { to: string; subject: string; text: string; replyTo?: string }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn("gifts: RESEND_API_KEY is not set, not emailed:", msg.subject);
    return;
  }
  try {
    const { error } = await new Resend(key).emails.send({
      from: "Cloverfield Studio <cloverfield@cloverfield.studio>",
      to: [msg.to],
      subject: msg.subject,
      text: msg.text,
      ...(msg.replyTo ? { replyTo: msg.replyTo } : {}),
    });
    if (error) console.error("gifts: email failed:", error.message);
  } catch (e) {
    console.error("gifts: email failed:", e);
  }
}

export const emailWilliam = (msg: { subject: string; text: string; replyTo?: string }) =>
  sendEmail({ to: "william@cloverfield.studio", ...msg });

/** Emails the client who sent a gift, from William. Skipped when they have no email. */
export async function emailClient(client: GiftClient, msg: { subject: string; lines: string[] }) {
  if (!client.email) return;
  await sendEmail({
    to: client.email,
    replyTo: "william@cloverfield.studio",
    subject: msg.subject,
    text: [`Hi ${client.firstName},`, "", ...msg.lines, "", "William", "Cloverfield Studio"].join("\n"),
  });
}
