/**
 * Lightweight verification of IKI brand+flow vs CM Vertikl campaign routing.
 * Run: node scripts/verify-iki-routing.mjs
 */
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

async function loadCore() {
  const corePath = path.join(root, "src/lib/vertikl/iki-campaigns-core.ts");
  try {
    return await import(pathToFileURL(corePath).href);
  } catch {
    const fs = await import("node:fs/promises");
    const source = await fs.readFile(corePath, "utf8");
    const tmp = path.join(root, "scripts/.iki-campaigns-core.tmp.mjs");
    const require = createRequire(import.meta.url);
    const ts = require("typescript");
    const out = ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.ESNext,
        target: ts.ScriptTarget.ES2022,
      },
      fileName: "iki-campaigns-core.ts",
    }).outputText;
    await fs.writeFile(tmp, out);
    try {
      return await import(pathToFileURL(tmp).href + `?t=${Date.now()}`);
    } finally {
      await fs.unlink(tmp).catch(() => {});
    }
  }
}

const {
  IKI_CAMPAIGN_ENV_BY_FLOW,
  IKI_CAMPAIGN_IDS,
  resolveIkiCampaignFromEnv,
} = await loadCore();

const CM_FACEBOOK_LP_ENV = "VERTIKL_CAMPAIGN_ID_META_FACEBOOK_LP";
const CM_DIRECT_ENV = "VERTIKL_CAMPAIGN_ID_DIRECT";
const CM_FACEBOOK_LP_ID = "69a3b4eb-4bf8-4d27-a99b-8464f696d9ea";
const CM_DIRECT_ID = "7c3fe47d-b534-496e-8de5-472f2e83f39c";

const ikiEnv = {
  [IKI_CAMPAIGN_ENV_BY_FLOW.lp]: IKI_CAMPAIGN_IDS.lp,
  [IKI_CAMPAIGN_ENV_BY_FLOW.meta_form]: IKI_CAMPAIGN_IDS.meta_form,
  [IKI_CAMPAIGN_ENV_BY_FLOW.chatbot]: IKI_CAMPAIGN_IDS.chatbot,
};

function pickCmCampaign(source) {
  const map = {
    facebook_paid: CM_FACEBOOK_LP_ENV,
    direct: CM_DIRECT_ENV,
  };
  return map[source];
}

function routeLead({ consentVariant, flow, acquisitionSource }) {
  if (consentVariant === "iki") {
    // Entry point supplies flow explicitly ( /iki → "lp" ).
    const iki = resolveIkiCampaignFromEnv(ikiEnv, flow, {
      landingPageUrl: "https://www.couverturemutuelle.fr/iki",
    });
    return { brand: "iki", flow: iki.flow, campaignId: iki.campaignId, env: iki.campaignEnv };
  }
  const envName = pickCmCampaign(acquisitionSource);
  const envValues = {
    [CM_FACEBOOK_LP_ENV]: CM_FACEBOOK_LP_ID,
    [CM_DIRECT_ENV]: CM_DIRECT_ID,
  };
  return {
    brand: "cm",
    flow: null,
    campaignId: envValues[envName],
    env: envName,
  };
}

// 1. /iki → IKI LP
{
  const r = routeLead({
    consentVariant: "iki",
    flow: "lp",
    acquisitionSource: "facebook_paid",
  });
  assert.equal(r.brand, "iki");
  assert.equal(r.flow, "lp");
  assert.equal(r.campaignId, IKI_CAMPAIGN_IDS.lp);
  assert.equal(r.env, IKI_CAMPAIGN_ENV_BY_FLOW.lp);
  console.log("✓ /iki → IKI LP");
}

// 2. resolver iki + chatbot → IKI CHATBOT
{
  const r = resolveIkiCampaignFromEnv(ikiEnv, "chatbot");
  assert.equal(r.brand, "iki");
  assert.equal(r.flow, "chatbot");
  assert.equal(r.campaignId, IKI_CAMPAIGN_IDS.chatbot);
  assert.equal(r.campaignEnv, IKI_CAMPAIGN_ENV_BY_FLOW.chatbot);
  console.log("✓ resolver iki + chatbot → IKI CHATBOT");
}

// 3. resolver iki + meta_form → IKI META FORM
{
  const r = resolveIkiCampaignFromEnv(ikiEnv, "meta_form");
  assert.equal(r.brand, "iki");
  assert.equal(r.flow, "meta_form");
  assert.equal(r.campaignId, IKI_CAMPAIGN_IDS.meta_form);
  assert.equal(r.campaignEnv, IKI_CAMPAIGN_ENV_BY_FLOW.meta_form);
  console.log("✓ resolver iki + meta_form → IKI META FORM");
}

// 4. CM Facebook paid → unchanged
{
  const r = routeLead({
    consentVariant: "senior",
    acquisitionSource: "facebook_paid",
  });
  assert.equal(r.brand, "cm");
  assert.equal(r.env, CM_FACEBOOK_LP_ENV);
  assert.equal(r.campaignId, CM_FACEBOOK_LP_ID);
  assert.notEqual(r.campaignId, IKI_CAMPAIGN_IDS.lp);
  console.log("✓ CM Facebook paid → unchanged");
}

// 5. CM direct → unchanged
{
  const r = routeLead({
    consentVariant: "default",
    acquisitionSource: "direct",
  });
  assert.equal(r.brand, "cm");
  assert.equal(r.env, CM_DIRECT_ENV);
  assert.equal(r.campaignId, CM_DIRECT_ID);
  console.log("✓ CM direct → unchanged");
}

console.log("\nAll IKI brand+flow routing checks passed.");
