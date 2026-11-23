/**
 * TEMP one-shot: mirror /devis precheck (lean fields) → acquire (full fields)
 * and print SAFE field diff + Vertikl response. No plaintext PII.
 */
import { createHash, randomUUID } from "crypto";
import { readFileSync } from "fs";
import { resolve } from "path";

function loadEnvLocal() {
  const raw = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
  for (const line of raw.split("\n")) {
    const m = /^([A-Z0-9_]+)=(.*)$/.exec(line.trim());
    if (!m) continue;
    if (!(m[1] in process.env)) process.env[m[1]] = m[2];
  }
}
loadEnvLocal();

const PII = new Set([
  "email",
  "phone",
  "first_name",
  "last_name",
  "consent_ip_address",
  "consent_user_agent",
  "consent_landing_page_url",
  "consent_referrer",
]);

function fp(v) {
  return createHash("sha256").update(String(v)).digest("hex").slice(0, 12);
}

function snap(fields, precheckId) {
  const keys = Object.keys(fields).sort();
  const entries = {};
  let emailFp = null;
  let phoneFp = null;
  for (const key of keys) {
    const raw = fields[key];
    const type = Array.isArray(raw) ? "array" : raw === null ? "null" : typeof raw;
    if (key === "email" && typeof raw === "string") {
      emailFp = fp(raw.trim().toLowerCase());
      entries[key] = { type, value: `fp:${emailFp}` };
    } else if (key === "phone" && typeof raw === "string") {
      phoneFp = fp(raw.trim());
      entries[key] = { type, value: `fp:${phoneFp}` };
    } else if (PII.has(key)) {
      entries[key] = {
        type,
        value:
          typeof raw === "string" && raw.trim() === ""
            ? "(empty-string)"
            : "(redacted)",
      };
    } else if (typeof raw === "string" && raw.trim() === "") {
      entries[key] = { type, value: "(empty-string)" };
    } else {
      entries[key] = { type, value: raw };
    }
  }
  return { precheckId, keys, entries, emailFp, phoneFp };
}

function compare(pre, acq) {
  const preSet = new Set(pre.keys);
  const acqSet = new Set(acq.keys);
  const PRECHECK_ONLY = pre.keys.filter((k) => !acqSet.has(k));
  const ACQUIRE_ONLY = acq.keys.filter((k) => !preSet.has(k));
  const DIFFERENT_VALUES = [];
  const MATCHING = [];
  for (const key of pre.keys) {
    if (!acqSet.has(key)) continue;
    const a = pre.entries[key];
    const b = acq.entries[key];
    const same =
      a.type === b.type && JSON.stringify(a.value) === JSON.stringify(b.value);
    if (same) MATCHING.push(key);
    else DIFFERENT_VALUES.push({ key, precheck: a, acquire: b });
  }
  return {
    PRECHECK_ONLY,
    ACQUIRE_ONLY,
    DIFFERENT_VALUES,
    MATCHING,
    precheckKeys: pre.keys,
    acquireKeys: acq.keys,
  };
}

const apiKey = process.env.VERTIKL_API_KEY?.trim();
const mode = (process.env.VERTIKL_API_MODE ?? "test").trim().toLowerCase();
const campaignId = "fed07381-9b38-4ff1-8cef-2d92d6b12989";
const endpointAcquire =
  mode === "production"
    ? "https://ebre.vertikl.app/api/leads"
    : "https://ebre.vertikl.app/api/leads/test";

if (!apiKey) {
  console.log(JSON.stringify({ error: "VERTIKL_API_KEY_MISSING" }));
  process.exit(1);
}

const stamp = Date.now();
const email = `cm.fields.diff.${stamp}@yahoo.fr`;
const phone = "+33785112233";

const precheckFields = {
  first_name: "Camille",
  last_name: "Dupont",
  email,
  phone,
  date_of_birth: "1960-01-01",
  postal_code: "69001",
  currently_insured: false,
  people_to_cover: "moi_conjoint",
  professional_statut: "salarié",
};

const precheckRes = await fetch("https://ebre.vertikl.app/api/leads/precheck", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-API-KEY": apiKey,
    "Idempotency-Key": `cm-fields-diff-${randomUUID()}`,
  },
  body: JSON.stringify({ campaignId, fields: precheckFields }),
});
const precheckBody = await precheckRes.json();
const buyers = Array.isArray(precheckBody.buyers) ? precheckBody.buyers : [];
const buyerIds = buyers.map((b) => b.id).filter(Boolean);

if (precheckBody.status !== "RESERVED" || !precheckBody.precheck_id) {
  console.log(
    JSON.stringify(
      {
        step: "precheck",
        httpStatus: precheckRes.status,
        status: precheckBody.status,
        reason: precheckBody.reason ?? null,
        note: "Cannot compare acquire — no RESERVED precheck_id",
        precheckKeys: Object.keys(precheckFields).sort(),
      },
      null,
      2,
    ),
  );
  process.exit(0);
}

const precheckId = precheckBody.precheck_id;
const expiresAt = precheckBody.expires_at;
const reservationExpired = Date.parse(expiresAt) <= Date.now();
const preSnap = snap(precheckFields, precheckId);

const collectedAt = new Date().toISOString();

// Acquire reuses the exact 9 core fields, then adds documented extras only.
const acquireFields = {
  ...precheckFields,
  city: "Lyon",
};

const acqSnap = snap(acquireFields, precheckId);
const fieldsCompare = compare(preSnap, acqSnap);

const acquirePayload = {
  campaignId,
  fields: acquireFields,
  precheck_id: precheckId,
  consent: {
    buyer_ids: buyerIds,
    collected_at: collectedAt,
  },
};

const acquireRes = await fetch(endpointAcquire, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-API-KEY": apiKey,
  },
  body: JSON.stringify(acquirePayload),
});
const acquireBody = await acquireRes.json().catch(() => null);

console.log(
  JSON.stringify(
    {
      mode,
      endpointPrecheck: "https://ebre.vertikl.app/api/leads/precheck",
      endpointAcquire,
      precheckId,
      expiresAt,
      reservationExpired,
      buyerCount: buyerIds.length,
      acquire: {
        httpStatus: acquireRes.status,
        success: acquireBody?.success ?? null,
        status: acquireBody?.status ?? null,
        failureMessage: acquireBody?.failureMessage ?? null,
      },
      precheckKeys: fieldsCompare.precheckKeys,
      acquireKeys: fieldsCompare.acquireKeys,
      PRECHECK_ONLY: fieldsCompare.PRECHECK_ONLY,
      ACQUIRE_ONLY: fieldsCompare.ACQUIRE_ONLY,
      DIFFERENT_VALUES: fieldsCompare.DIFFERENT_VALUES,
      MATCHING: fieldsCompare.MATCHING,
      emailFpMatch: preSnap.emailFp === acqSnap.emailFp,
      phoneFpMatch: preSnap.phoneFp === acqSnap.phoneFp,
    },
    null,
    2,
  ),
);
