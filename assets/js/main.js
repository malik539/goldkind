/* Goldkind Family Orthodontics — $1,000 Off landing page
   Countdown · lead form · sticky mobile CTA · review truncation · tracking hooks */
(function () {
  'use strict';

  /* ===================== CONFIG (edit before launch) ===================== */
  var CONFIG = {
    // Lead destination. Native form posts JSON here (e.g. a GoHighLevel / LeadConnector
    // inbound webhook URL or your own endpoint). Required for the native form to submit.
    FORM_ENDPOINT: '',
    // Optional: existing LeadConnector form embed URL
    // (https://api.leadconnectorhq.com/widget/form/XXXX). When set, the native fields are
    // replaced by the GHL iframe inside the same card, preserving the original integration.
    GHL_FORM_EMBED_URL: '',
    // Optional thank-you page redirect after a successful native submission.
    THANK_YOU_URL: '',
    // Offer deadline: end of day, October 31st, 2026, Morristown NJ local time.
    OFFER_END: { year: 2026, month: 10, day: 31, hour: 23, minute: 59, second: 59 },
    TIMEZONE: 'America/New_York',
    // Patient testimonial videos (approved: Tommy and Aiden, Braces Treatment). Fill `src` with
    // the direct video file URL (.mp4 / .webm) from the GHL media library; `poster` is the
    // thumbnail image. The section renders only when every entry has a src.
    TESTIMONIAL_VIDEOS: [
      { name: 'Tommy', treatment: 'Braces Treatment', src: 'https://assets.cdn.filesafe.space/1c5e8iQm9RJiApRw9gUw/media/6917dc485d55fc13ea3f3820.mp4', poster: 'https://assets.cdn.filesafe.space/1c5e8iQm9RJiApRw9gUw/media/69e73a4d2c135a8c83d77370.png' },
      { name: 'Aiden', treatment: 'Braces Treatment', src: 'https://assets.cdn.filesafe.space/1c5e8iQm9RJiApRw9gUw/media/6917db3df117fc71bd20dcd6.mp4', poster: 'https://assets.cdn.filesafe.space/1c5e8iQm9RJiApRw9gUw/media/69e73987c56ad2790865f546.png' }
    ],
    MIN_SECONDS_BEFORE_SUBMIT: 3
  };
  /* ====================================================================== */

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* ---------- dataLayer helper ---------- */
  window.dataLayer = window.dataLayer || [];
  function track(event, data) {
    var payload = { event: event };
    if (data) { for (var k in data) { if (Object.prototype.hasOwnProperty.call(data, k)) { payload[k] = data[k]; } } }
    window.dataLayer.push(payload);
  }

  /* ---------- Timezone-aware countdown ---------- */
  function zonedTimeToUtc(y, m, d, h, mi, s, tz) {
    var guess = Date.UTC(y, m - 1, d, h, mi, s);
    var fmt;
    try {
      fmt = new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' });
    } catch (e) {
      return guess + 4 * 3600 * 1000; // fallback: EDT (UTC-4) for an October deadline
    }
    function wallClockAsUtc(date) {
      var p = {};
      fmt.formatToParts(date).forEach(function (x) { p[x.type] = x.value; });
      return Date.UTC(+p.year, +p.month - 1, +p.day, (+p.hour) % 24, +p.minute, +p.second);
    }
    var t = guess;
    for (var i = 0; i < 2; i++) { t = guess - (wallClockAsUtc(new Date(t)) - t); }
    return t;
  }

  function initCountdown() {
    var el = $('#countdown');
    if (!el) { return; }
    var o = CONFIG.OFFER_END;
    var deadline = zonedTimeToUtc(o.year, o.month, o.day, o.hour, o.minute, o.second, CONFIG.TIMEZONE);
    var nums = {};
    $$('[data-unit]', el).forEach(function (n) { nums[n.getAttribute('data-unit')] = n; });
    var label = $('.countdown-label', el);
    var timer;

    function pad(n) { return (n < 10 ? '0' : '') + n; }
    function tick() {
      var diff = deadline - Date.now();
      if (diff <= 0) {
        el.classList.add('ended');
        if (label) { label.textContent = 'This offer has ended'; }
        if (timer) { clearInterval(timer); }
        return;
      }
      var s = Math.floor(diff / 1000);
      nums.days.textContent = Math.floor(s / 86400);
      nums.hours.textContent = pad(Math.floor((s % 86400) / 3600));
      nums.minutes.textContent = pad(Math.floor((s % 3600) / 60));
      nums.seconds.textContent = pad(s % 60);
    }
    tick();
    timer = setInterval(tick, 1000);
  }

  /* ---------- Smooth scroll to form ---------- */
  function initScrollLinks() {
    var target = $('#lead-form');
    if (!target) { return; }
    $$('.js-scroll').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
        var first = $('#first_name');
        if (first && !first.disabled) { setTimeout(function () { first.focus({ preventScroll: true }); }, reduce ? 0 : 450); }
      });
    });
  }

  /* ---------- Tracking: CTA + phone clicks ---------- */
  function initTracking() {
    $$('[data-track]').forEach(function (el) {
      el.addEventListener('click', function () {
        var ev = el.getAttribute('data-track');
        track(ev, { cta_label: (el.textContent || '').trim(), href: el.getAttribute('href') || '' });
      });
    });
  }

  /* ---------- Reviews: running ticker ---------- */
  function initTicker() {
    var ticker = $('#review-ticker');
    var track = $('#ticker-track');
    var set = track && $('.ticker-set', track);
    if (!ticker || !track || !set) { return; }
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Duplicate the card set once so the loop is seamless (clone is decorative).
    var clone = set.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    $$('button', clone).forEach(function (b) { b.tabIndex = -1; });
    track.appendChild(clone);

    function setDuration() {
      var speed = parseFloat(getComputedStyle(ticker).getPropertyValue('--speed')) || 48; // px per second
      var distance = set.getBoundingClientRect().width;
      track.style.setProperty('--dur', Math.max(20, Math.round(distance / speed)) + 's');
    }
    if (!reduce) {
      setDuration();
      track.classList.add('animate');
      window.addEventListener('resize', setDuration);
      if (document.fonts && document.fonts.ready) { document.fonts.ready.then(setDuration); }
    }

    var toggle = $('#ticker-toggle');
    var label = toggle && $('.ticker-toggle-label', toggle);
    var userPaused = false;
    function applyPause() {
      var paused = userPaused || $$('.review-text.expanded', track).length > 0;
      ticker.classList.toggle('paused', paused);
    }
    if (toggle) {
      toggle.addEventListener('click', function () {
        userPaused = !userPaused;
        toggle.setAttribute('aria-pressed', String(userPaused));
        if (label) { label.textContent = userPaused ? 'Play reviews' : 'Pause reviews'; }
        applyPause();
      });
    }

    // Read more / less (works for originals and clones; expanding pauses the ticker)
    $$('.review-card', track).forEach(function (card) {
      var text = $('.review-text', card);
      var btn = $('.read-more', card);
      if (!text || !btn) { return; }
      function check() {
        if (text.classList.contains('expanded')) { return; }
        btn.hidden = text.scrollHeight <= text.clientHeight + 2;
      }
      btn.addEventListener('click', function () {
        var open = text.classList.toggle('expanded');
        btn.setAttribute('aria-expanded', String(open));
        btn.textContent = open ? 'Read less' : 'Read more';
        applyPause();
      });
      check();
      window.addEventListener('resize', check);
      if (document.fonts && document.fonts.ready) { document.fonts.ready.then(check); }
    });
  }

  /* ---------- Sticky mobile CTA ---------- */
  function initStickyCta() {
    var bar = $('#sticky-cta');
    var form = $('#lead-form');
    if (!bar || !form) { return; }
    var pastHero = false, formVisible = true;
    function update() {
      var show = pastHero && !formVisible;
      bar.classList.toggle('visible', show);
      bar.setAttribute('aria-hidden', String(!show));
    }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        formVisible = entries[0].isIntersecting; update();
      }, { threshold: 0.15 }).observe(form);
    } else { formVisible = false; }
    window.addEventListener('scroll', function () {
      var next = window.scrollY > 240;
      if (next !== pastHero) { pastHero = next; update(); }
    }, { passive: true });
  }

  /* ---------- Lead form ---------- */
  function initForm() {
    var form = $('#offer-form');
    if (!form) { return; }

    // Option B: swap in the existing LeadConnector iframe (preserves GHL integration)
    if (CONFIG.GHL_FORM_EMBED_URL) {
      var frame = document.createElement('iframe');
      frame.src = CONFIG.GHL_FORM_EMBED_URL;
      frame.title = 'Claim My $1,000 Discount form';
      frame.setAttribute('style', 'width:100%;border:0;min-height:640px;');
      frame.setAttribute('loading', 'eager');
      form.parentNode.replaceChild(frame, form);
      var s = document.createElement('script');
      s.src = 'https://link.msgsndr.com/js/form_embed.js';
      s.async = true;
      document.body.appendChild(s);
      return;
    }

    $('#form_started_at').value = String(Date.now());
    $('#source_page').value = window.location.href;

    var fields = ['first_name', 'last_name', 'phone', 'email', 'patient_type', 'zip', 'consent'];
    var messages = {
      first_name: 'Please enter your first name.',
      last_name: 'Please enter your last name.',
      phone: 'Please enter a valid phone number.',
      email: 'Please enter a valid email address.',
      patient_type: 'Please let us know if you are a new or existing patient.',
      zip: 'Please enter a valid 5-digit zip code.',
      consent: 'Please agree to the terms to continue.'
    };

    function validateField(name) {
      var input = form.elements[name];
      var wrap = input.closest('.field');
      var err = $('#' + name + '-error');
      var ok = true;
      var v = (input.value || '').trim();
      if (name === 'consent') { ok = input.checked; }
      else if (name === 'phone') { ok = v.replace(/\D/g, '').length >= 10; }
      else if (name === 'email') { ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); }
      else if (name === 'zip') { ok = /^\d{5}(-\d{4})?$/.test(v); }
      else { ok = v.length > 0; }
      wrap.classList.toggle('invalid', !ok);
      input.setAttribute('aria-invalid', String(!ok));
      if (err) { err.textContent = ok ? '' : messages[name]; }
      return ok;
    }

    fields.forEach(function (name) {
      var input = form.elements[name];
      if (!input) { return; }
      input.addEventListener('blur', function () { validateField(name); });
      input.addEventListener('input', function () {
        if (input.closest('.field').classList.contains('invalid')) { validateField(name); }
      });
      input.addEventListener('change', function () { validateField(name); });
    });

    var status = $('#form-status');
    function showError(msg) { status.textContent = msg; status.className = 'form-status error'; }
    function clearError() { status.textContent = ''; status.className = 'form-status'; }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      clearError();
      var firstBad = null;
      fields.forEach(function (name) { if (!validateField(name) && !firstBad) { firstBad = form.elements[name]; } });
      if (firstBad) { firstBad.focus(); return; }

      // Bot protection: honeypot must be empty, and form must not be submitted instantly.
      var elapsed = (Date.now() - Number($('#form_started_at').value || 0)) / 1000;
      if (form.elements.company_website.value || elapsed < CONFIG.MIN_SECONDS_BEFORE_SUBMIT) {
        showError('Something went wrong. Please try again or call 862-314-3913.');
        return;
      }

      if (!CONFIG.FORM_ENDPOINT) {
        showError('Online booking is temporarily unavailable. Please call 862-314-3913 to claim your discount.');
        if (window.console) { console.error('[Goldkind] CONFIG.FORM_ENDPOINT is not set — form cannot submit.'); }
        return;
      }

      var data = {};
      new FormData(form).forEach(function (v, k) { if (k !== 'company_website') { data[k] = v; } });
      data.submitted_at = new Date().toISOString();

      form.classList.add('submitting');
      fetch(CONFIG.FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then(function (res) {
        if (!res.ok) { throw new Error('HTTP ' + res.status); }
        track('lead_form_submit', { form_id: 'offer-form', patient_type: data.patient_type });
        if (CONFIG.THANK_YOU_URL) { window.location.assign(CONFIG.THANK_YOU_URL); return; }
        var success = $('#form-success');
        form.hidden = true;
        success.hidden = false;
        success.focus();
      }).catch(function (err) {
        form.classList.remove('submitting');
        showError('We couldn’t send your request. Please try again or call 862-314-3913.');
        if (window.console) { console.error('[Goldkind] form submit failed', err); }
      });
    });
  }

  /* ---------- Patient testimonial videos ---------- */
  function initTestimonials() {
    var wrap = $('#testimonials');
    var grid = $('#testi-grid');
    var items = CONFIG.TESTIMONIAL_VIDEOS || [];
    if (!wrap || !grid || !items.length || items.some(function (v) { return !v.src; })) { return; }
    items.forEach(function (v) {
      var card = document.createElement('figure');
      card.className = 'testi-card';
      var video = document.createElement('video');
      video.controls = true; video.preload = 'none'; video.playsInline = true;
      if (v.poster) { video.poster = v.poster; }
      video.setAttribute('aria-label', v.name + ' — ' + v.treatment + ' patient testimonial');
      var source = document.createElement('source');
      source.src = v.src;
      video.appendChild(source);
      video.addEventListener('play', function () {
        $$('video', grid).forEach(function (other) { if (other !== video) { other.pause(); } });
        track('video_play', { video_name: v.name });
      });
      var cap = document.createElement('figcaption');
      cap.innerHTML = '<strong></strong><span></span>';
      cap.firstChild.textContent = v.name;
      cap.lastChild.textContent = v.treatment;
      card.appendChild(video); card.appendChild(cap); grid.appendChild(card);
    });
    wrap.hidden = false;
  }

  function init() {
    initCountdown();
    initScrollLinks();
    initTracking();
    initTicker();
    initTestimonials();
    initStickyCta();
    initForm();
    var y = $('#year'); if (y) { y.textContent = String(new Date().getFullYear()); }
  }
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); } else { init(); }
})();
