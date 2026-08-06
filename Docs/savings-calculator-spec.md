# Savings Calculator – Functional Specifications

Version: 1.0

---

# Objective

The Savings Calculator is the first step of the user journey.

Its purpose is **not** to generate a real insurance quote.

Its objectives are:

- provide a realistic estimate of potential savings;
- reassure the visitor;
- encourage them to continue to the quote request form;
- pre-fill the main quote form with already collected information.

---

# User Journey

Landing Page

↓

Savings Calculator

↓

Estimated Savings

↓

"Receive my free quotes"

↓

Main Quote Form

↓

Lead sent through API

---

# General Principles

This calculator:

- never compares insurers in real time;
- never displays a guaranteed saving;
- never generates an insurance quote;
- always displays an indicative estimation.

Allowed wording:

- Estimated savings
- Potential savings
- Indicative calculation
- Personalised estimate

Forbidden wording:

- Guaranteed savings
- Best price
- Cheapest insurer
- Guaranteed quote
- Lowest price on the market

---

# Information Collected

## Date of birth

Format

JJ/MM/AAAA

Example

14/06/1956

This value MUST be reused automatically inside the main quote form.

The user must NEVER enter it twice.

---

## Current monthly premium

Numeric input

Minimum

20 €

Maximum

300 €

Placeholder

95 €

---

## Current insurer seniority

Options

- Less than 2 years
- Between 2 and 5 years
- More than 5 years

---

## Desired protection level

### Essentiel

Basic reimbursements.

Suitable for users wanting the lowest monthly premium.

---

### Confort

Balanced protection.

Best value for money.

---

### Premium

Higher reimbursements for:

- Dental
- Optical
- Hearing
- Hospitalisation

---

### Sérénité +

Maximum protection.

Designed for users who want the highest reimbursements and peace of mind.

---

# UI

Reuse the current design system.

DO NOT introduce:

- new colours
- new buttons
- new typography
- new shadows

Reuse existing components whenever possible.

---

# Behaviour

The Calculate button stays disabled until:

- birth date
- premium
- seniority
- protection level

have been completed.

---

# Result Screen

The calculator displays:

Estimated yearly savings

Estimated monthly savings

Estimated monthly premium

CTA

Receive my free quotes

Secondary button

Calculate again

---

# Data Persistence

Calculator answers are stored globally.

Recommended:

React Context

or

Zustand

The main form automatically retrieves:

- date of birth
- premium
- seniority
- protection level

Those values are sent later through the lead API.

---

# Special Case

## Premium below €50/month

Never display a fake saving.

Display instead:

"Your current premium already appears very competitive.

Although price is important, choosing a health insurance policy should also consider your expected reimbursements and future out-of-pocket healthcare costs.

A personalised comparison is recommended."

CTA

Check my guarantees

---

# Calculation Rules

The calculation is NOT implemented yet.

A dedicated specification will define:

- reference prices
- calculation algorithm
- savings limits
- yearly caps
- edge cases

Until then:

Display only a placeholder result.

---

# Responsive

Desktop

Two-column layout.

Tablet

Optimised spacing.

Mobile

Stacked layout.

Large touch targets.

No horizontal scrolling.

---

# Accessibility

Use semantic HTML.

Keyboard navigation.

ARIA labels.

Focus states.

Reduced motion support.

---

# Development Rules

Use TypeScript.

No any.

Reusable components.

No duplicated code.

Separate UI from business logic.

Business logic will be added later.

---

# Important

The Savings Calculator is Step 1.

The Quote Form becomes Step 2.

Never ask twice for information already collected.