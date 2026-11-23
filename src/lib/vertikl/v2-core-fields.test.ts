import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { initialFormData, type QuoteFormData } from "@/components/form/types";
import { buildVertiklFields } from "@/lib/vertikl/build-payload";
import {
  buildV2VertiklCoreFields,
  buildV2VertiklCoreFieldsFromForm,
  compareV2VertiklCoreFields,
  pickV2VertiklCoreFields,
  splitVertiklAcquireFields,
  V2_VERTIKL_CORE_FIELD_KEYS,
} from "@/lib/vertikl/v2-core-fields";

function sampleForm(overrides: Partial<QuoteFormData> = {}): QuoteFormData {
  return {
    ...initialFormData,
    alreadyInsured: "non",
    coveredPersons: "moi-conjoint",
    professionalStatus: "employee",
    birthDate: "01/01/1960",
    postalCode: "69001",
    city: "Lyon",
    firstName: "Camille",
    lastName: "Dupont",
    phone: "06 12 34 56 78",
    email: "camille.dupont@example.com",
    consent: true,
    civility: "mme",
    spouseBirthDate: "15/03/1962",
    healthInsuranceGoal: "pay_less",
    ...overrides,
  };
}

describe("V2 Vertikl core fields (precheck ↔ acquire)", () => {
  it("builds exactly the 9 Vertikl qualification fields", () => {
    const core = buildV2VertiklCoreFields({
      firstName: "  Camille ",
      lastName: " Dupont",
      phone: "0612345678",
      email: " camille.dupont@example.com ",
      birthDate: "01/01/1960",
      postalCode: "69001",
      alreadyInsured: "non",
      coveredPersons: "moi-conjoint",
      professionalStatus: "employee",
    });

    assert.deepEqual(Object.keys(core).sort(), [...V2_VERTIKL_CORE_FIELD_KEYS].sort());
    assert.equal(core.first_name, "Camille");
    assert.equal(core.last_name, "Dupont");
    assert.equal(core.phone, "+33612345678");
    assert.equal(core.email, "camille.dupont@example.com");
    assert.equal(core.date_of_birth, "1960-01-01");
    assert.equal(core.postal_code, "69001");
    assert.equal(core.currently_insured, false);
    assert.equal(core.people_to_cover, "moi_conjoint");
    assert.equal(core.professional_statut, "salarié");
    assert.equal(Object.prototype.hasOwnProperty.call(core, "city"), false);
    assert.equal(
      Object.prototype.hasOwnProperty.call(core, "consent_given"),
      false,
    );
  });

  it("keeps the 9 core fields identical between precheck and acquire", () => {
    const form = sampleForm();
    const precheck = buildV2VertiklCoreFieldsFromForm(form);
    const acquire = buildVertiklFields({
      form,
      consentAt: new Date("2026-11-23T10:00:00.000Z"),
    });

    const acquireCore = pickV2VertiklCoreFields(
      acquire as Record<string, unknown>,
    );
    assert.ok(acquireCore, "acquire must include all 9 core fields");
    assert.deepEqual(
      compareV2VertiklCoreFields(precheck, acquireCore),
      { identical: true, differentKeys: [] },
    );
  });

  it("forwards documented acquire extras without inventing unknown keys", () => {
    const form = sampleForm();
    const acquire = buildVertiklFields({
      form,
      consentAt: new Date("2026-11-23T10:00:00.000Z"),
    });
    const split = splitVertiklAcquireFields(acquire);

    assert.ok(split.core);
    assert.deepEqual(split.unknownKeys, []);
    assert.ok(split.extraKeys.includes("city"));
    assert.ok(split.extraKeys.includes("gender"));
    assert.ok(split.extraKeys.includes("partner_date_of_birth"));
    assert.ok(split.extraKeys.includes("health_insurance_goal"));
    assert.equal(acquire.city, "Lyon");
    assert.equal(acquire.gender, "Madame");
    assert.equal(acquire.partner_date_of_birth, "1962-03-15");
    assert.deepEqual(acquire.health_insurance_goal, ["save_money"]);
    assert.equal(
      Object.prototype.hasOwnProperty.call(acquire, "consent_given"),
      false,
    );
  });

  it("rejects incomplete qualification before precheck", () => {
    assert.throws(
      () =>
        buildV2VertiklCoreFields({
          firstName: "",
          lastName: "Dupont",
          phone: "0612345678",
          email: "a@b.fr",
          birthDate: "01/01/1960",
          postalCode: "69001",
          alreadyInsured: "non",
          coveredPersons: "moi",
          professionalStatus: "employee",
        }),
      /firstName/,
    );
  });
});
