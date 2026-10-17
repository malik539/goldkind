# Goldkind Family Orthodontics — $1,000 Off PPC Landing Page

Static, dependency-free landing page for the **Save $1,000 on Invisalign® or Braces** promotion
(New Patients Only · Valid until October 31st, 2026).

```
index.html            page markup (7 sections + header/offer bar + mobile sticky CTA)
assets/css/styles.css styles (brand: navy #201C44, gold #DBB310)
assets/js/main.js     countdown, lead form, sticky CTA, read-more, dataLayer events
assets/img/           logo, reviewer avatars (from approved content), doctor placeholder
```

Open `index.html` directly or serve the folder with any static host.

## Before launch — required configuration

All settings live in the `CONFIG` block at the top of `assets/js/main.js`.

| Setting | What to do |
| --- | --- |
| `FORM_ENDPOINT` | URL that receives the native form as JSON (e.g. a GoHighLevel / LeadConnector inbound webhook). Until this is set, submitting shows a "call us" message and logs a console error. |
| `GHL_FORM_EMBED_URL` | **Alternative:** paste the existing LeadConnector form embed URL. The native fields are replaced by the GHL iframe inside the same form card, so the original form, consent and bot protection are preserved. |
| `THANK_YOU_URL` | Optional redirect after a successful native submission (useful for Google Ads conversion pages). |

Native form fields posted: `first_name`, `last_name`, `phone`, `email`, `patient_type`
(New Patient / Existing Patient), `zip`, `consent`, `offer`, `source_page`, `form_started_at`, `submitted_at`.

**Tracking:** paste the GTM head/body snippets where marked in `index.html`. The page pushes
`lead_form_submit`, `phone_click` and `cta_click` to `dataLayer` for conversion tracking.

**Bot protection (native form):** honeypot field + minimum time-to-submit check. If the production
form uses reCAPTCHA/Turnstile, mount it in the marked slot inside the form.

## Items flagged for review (not in the approved content file)

1. **FAQ answers.** The content file lists the 7 FAQ questions but no answers. Three answers are built
   from approved copy (free consultation, "never too late / all ages", how to claim). The other four
   are **hidden** (`<details data-review="pending">` in `index.html`) and must not be shown until an
   approved answer is supplied — then replace the placeholder text and remove the `data-review` attribute:
   - How much do braces or Invisalign cost in Morristown?
   - Do you accept insurance and offer payment plans?
   - How long does Invisalign or braces treatment take?
   - Does it hurt to get braces or Invisalign?
2. **Dr. Goldkind photo.** No image was supplied. `assets/img/dr-goldkind-placeholder.svg` is a
   clearly-labelled brand placeholder; swap the `src` in the "Meet Dr. Goldkind" section for the
   approved portrait (recommended ~800×960, portrait).
3. **Hero image.** No patient/practice photo was supplied, so the hero uses a branded gradient with
   the form card as the visual anchor. An approved photo can be added as a hero background later.
4. **Testimonial videos (Tommy, Aiden — Braces Treatment).** Referenced in the content but no video
   assets were supplied; the FAQ section has a marked slot for them.
5. **Logo.** The supplied logo is a 202×123 PNG; a vector (SVG) or 2× PNG would be sharper on retina screens.

## Content rules applied

- Offer, dates, eligibility, disclaimers, reviews, doctor bio and treatment copy are verbatim from the
  approved content file. Review text is untouched (including original typos) and truncated only visually.
- Deadline everywhere: **October 31st, 2026**. Countdown targets 11:59:59 PM America/New_York on that
  date, updates every second, and switches to "This offer has ended" with no negative values.
- Phone `862-314-3913` / `tel:8623143913`; address 28 DeHart St., Morristown, NJ 07960; Mon–Fri 9:00 AM–5:00 PM.
