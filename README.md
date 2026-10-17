# Goldkind Family Orthodontics — $1,000 Off PPC Landing Page

Static, dependency-free landing page for the **Save $1,000 on Invisalign® or Braces** promotion
(New Patients Only · Valid until October 31st, 2026).

```
index.html            page markup (hero, reviews, offer, doctor, testimonials, FAQ, final CTA + header/offer bar + sticky CTA)
assets/css/styles.css styles (brand: navy #201C44, gold #DBB310)
assets/js/main.js     countdown, lead form, sticky CTA, read-more, dataLayer events
assets/img/           logo, Dr. Goldkind photo, promo photo, reviewer avatars
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
2. **Hero image.** No hero-specific patient/practice photo was supplied, so the hero uses a branded
   gradient with the form card as the visual anchor. An approved photo can be added as a hero background later.
3. **Testimonial videos (Tommy, Aiden — Braces Treatment).** Wired in `CONFIG.TESTIMONIAL_VIDEOS`
   (`assets/js/main.js`) to the supplied GHL-hosted `.mp4` files with the supplied `.png` posters.
   The Tommy/Aiden ↔ video mapping follows the order the links were supplied; confirm it, and swap
   the two `src` values if reversed. Playback could not be verified from the build environment.
4. **Photo resolution.** The supplied Dr. Goldkind photo (532×404) and the "Fall Into a New Smile"
   photo (524×529) are displayed at up to ~480px wide; higher-resolution originals would be sharper on retina screens.
5. **Logo.** The supplied logo is a 202×123 PNG; a vector (SVG) or 2× PNG would be sharper on retina screens.

## Content rules applied

- Offer, dates, eligibility, disclaimers, reviews, doctor bio and treatment copy are verbatim from the
  approved content file. Review text is untouched (including original typos) and truncated only visually.
- The review ticker holds 21 real Google reviews: 6 from the content file and 15 transcribed from the
  supplied screenshots of the live reviews widget. Reviews that were truncated in the screenshots end
  in "…" exactly as shown; supply the full text to complete them. Relative dates ("2 months ago") are
  omitted because they go stale. Ticker speed: `--speed` in `styles.css` (px/s); it pauses on hover,
  on Read more, via the Pause button, and is disabled under `prefers-reduced-motion`.
- Deadline everywhere: **October 31st, 2026**. Countdown targets 11:59:59 PM America/New_York on that
  date, updates every second, and switches to "This offer has ended" with no negative values.
- Phone `862-314-3913` / `tel:8623143913`; address 28 DeHart St., Morristown, NJ 07960; Mon–Fri 9:00 AM–5:00 PM.
