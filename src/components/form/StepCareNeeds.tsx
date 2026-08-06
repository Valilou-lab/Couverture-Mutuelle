"use client";

import { CARE_NEEDS, type CareNeedId, type QuoteFormData } from "./types";
import { CARE_NEED_ICONS } from "./CareNeedIcons";
import { OptionCard } from "./OptionCard";
import { FormNavigation } from "./FormNavigation";
import type { FieldErrors } from "./validation";

type Props = {
  data: QuoteFormData;
  errors: FieldErrors;
  disabled?: boolean;
  onChange: (careNeeds: CareNeedId[]) => void;
  onNext: () => void;
};

export function StepCareNeeds({
  data,
  errors,
  disabled = false,
  onChange,
  onNext,
}: Props) {
  function toggle(id: CareNeedId) {
    if (disabled) return;
    if (id === "je-ne-sais-pas") {
      onChange(data.careNeeds.includes(id) ? [] : ["je-ne-sais-pas"]);
      return;
    }

    const withoutUnknown = data.careNeeds.filter(
      (item) => item !== "je-ne-sais-pas",
    );
    const next = withoutUnknown.includes(id)
      ? withoutUnknown.filter((item) => item !== id)
      : [...withoutUnknown, id];
    onChange(next);
  }

  const mainNeeds = CARE_NEEDS.filter((item) => item.id !== "je-ne-sais-pas");
  const unknownNeed = CARE_NEEDS.find((item) => item.id === "je-ne-sais-pas");

  return (
    <div>
      <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
        Que souhaitez-vous couvrir en priorité&nbsp;?
      </h2>
      <p className="mt-2 text-sm text-zinc-600 sm:text-base">
        (multi-choix possible)
      </p>
      <div className="mt-5 grid grid-cols-2 gap-2.5">
        {mainNeeds.map((item) => (
          <OptionCard
            key={item.id}
            label={item.label}
            icon={CARE_NEED_ICONS[item.id]}
            selected={data.careNeeds.includes(item.id)}
            disabled={disabled}
            showCheckbox
            onClick={() => toggle(item.id)}
          />
        ))}
        {unknownNeed ? (
          <div className="col-span-2">
            <OptionCard
              label={unknownNeed.label}
              icon={CARE_NEED_ICONS[unknownNeed.id]}
              selected={data.careNeeds.includes(unknownNeed.id)}
              disabled={disabled}
              showCheckbox
              onClick={() => toggle(unknownNeed.id)}
            />
          </div>
        ) : null}
      </div>
      {errors.careNeeds ? (
        <p className="mt-3 text-sm text-error" role="alert">
          {errors.careNeeds}
        </p>
      ) : null}
      <FormNavigation
        showBack={false}
        onNext={onNext}
        disabled={disabled}
      />
    </div>
  );
}
