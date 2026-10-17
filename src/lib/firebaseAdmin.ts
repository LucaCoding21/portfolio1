import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore, initializeFirestore, type Firestore } from "firebase-admin/firestore";
import { readFileSync } from "node:fs";
import path from "node:path";

/**
 * Firestore, server only. It is Command Center's Firebase project (the
 * mysoftware repo), so both apps share the referral collections: this site
 * writes gifts and claims, Command Center adds clients and shows the gifts.
 *
 * The service account is a private key with full access to that project.
 * It must never reach the browser, so never give it a NEXT_PUBLIC_ name.
 *
 *   FIREBASE_SERVICE_ACCOUNT_JSON  the key file's contents (Vercel)
 *   FIREBASE_SERVICE_ACCOUNT_PATH  a path to the key file (local)
 */
function loadServiceAccount() {
  const inline = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (inline) return JSON.parse(inline);
  const rel = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  if (!rel) throw new Error("Set FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_SERVICE_ACCOUNT_PATH");
  const abs = path.isAbsolute(rel) ? rel : path.join(process.cwd(), rel);
  return JSON.parse(readFileSync(abs, "utf8"));
}

// Lazy, so `next build` never needs the key: it is read on the first query.
let db: Firestore | undefined;

export function firestore(): Firestore {
  if (db) return db;
  const sa = loadServiceAccount();
  const app = getApps()[0] ?? initializeApp({ credential: cert(sa), projectId: sa.project_id });
  // HTTPS instead of gRPC: a cold serverless function starts much faster,
  // and nothing here uses the live listeners that need gRPC.
  try {
    db = initializeFirestore(app, { preferRest: true });
  } catch {
    // A dev reload, in a process that already set Firestore up differently.
    db = getFirestore(app);
  }
  return db;
}
