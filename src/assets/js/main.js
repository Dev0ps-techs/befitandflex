/* Be Fit & Flex — interactions (no dependencies) */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const CFG = window.BFF || {};
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const toastEl = $('.toast');
  let tt;
  const toast = (m) => { if (!toastEl) return; toastEl.textContent = m; toastEl.classList.add('is-on'); clearTimeout(tt); tt = setTimeout(() => toastEl.classList.remove('is-on'), 3200); };
  const escH = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const waLink = (t) => `https://wa.me/${CFG.wa}?text=${encodeURIComponent(t)}`;
  const store = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  };
  const send = async (payload) => {
    if (!CFG.endpoint) return false;
    try {
      const r = await fetch(CFG.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload) });
      return r.ok;
    } catch { return false; }
  };

  $$('[data-year]').forEach((e) => (e.textContent = new Date().getFullYear()));

  // mobile menu
  const burger = $('.burger'), nav = $('#nav');
  const setNav = (o) => { burger.setAttribute('aria-expanded', o); burger.setAttribute('aria-label', o ? 'Close menu' : 'Open menu'); nav.classList.toggle('is-open', o); document.body.style.overflow = o ? 'hidden' : ''; };
  burger?.addEventListener('click', () => setNav(burger.getAttribute('aria-expanded') !== 'true'));
  nav?.addEventListener('click', (e) => { if (e.target.closest('a')) setNav(false); });

  // reveal on scroll
  const els = $$('[data-reveal]');
  if ('IntersectionObserver' in window && !reduced) {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -6% 0px' });
    els.forEach((e) => io.observe(e));
  } else els.forEach((e) => e.classList.add('in'));

  // shop category filter (also reacts to #category links)
  const grid = $('[data-grid]');
  if (grid) {
    const chips = $$('[data-filter]');
    const apply = (cat) => {
      chips.forEach((c) => c.classList.toggle('is-on', c.dataset.filter === cat));
      $$('.block', grid).forEach((b) => { b.hidden = cat !== 'all' && b.dataset.cat !== cat && b.dataset.gender !== cat; if (!b.hidden) $$('[data-reveal]', b).forEach((x) => x.classList.add('in')); });
      $$('.gblock', grid).forEach((g) => { g.hidden = !$$('.block', g).some((b) => !b.hidden); });
    };
    chips.forEach((c) => c.addEventListener('click', () => { apply(c.dataset.filter); history.replaceState(null, '', c.dataset.filter === 'all' ? location.pathname : '#' + c.dataset.filter); }));
    const fromHash = () => { const h = location.hash.slice(1); apply(chips.some((c) => c.dataset.filter === h) ? h : 'all'); };
    addEventListener('hashchange', fromHash); fromHash();
  }

  // product page: gallery, colour, size, quantity
  const pdp = $('[data-product]');
  let colour = '', size = '';
  if (pdp) {
    const P = JSON.parse(pdp.dataset.product);
    const main = $('.gallery__main img');
    const thumbsBox = $('[data-thumbs]');
    const bindThumbs = () => $$('.thumb', thumbsBox).forEach((t) => t.addEventListener('click', () => {
      main.removeAttribute('srcset'); main.src = t.dataset.src;
      $$('.thumb', thumbsBox).forEach((x) => x.classList.toggle('is-on', x === t));
    }));
    bindThumbs();
    colour = P.colours[0].name;
    $$('[data-colour-pick]').forEach((b) => b.addEventListener('click', () => {
      colour = b.dataset.colourPick;
      $('[data-colour]').textContent = b.dataset.label;
      $$('[data-colour-pick]').forEach((x) => x.classList.toggle('is-on', x === b));
      const imgs = JSON.parse(b.dataset.images);
      main.removeAttribute('srcset'); main.src = imgs[0]; main.alt = `${P.name} — ${colour}`;
      const tpl = $$('template[data-colour-thumbs]').find((t) => t.dataset.colourThumbs === colour);
      thumbsBox.innerHTML = tpl ? tpl.innerHTML : ''; bindThumbs();
    }));
    const want = decodeURIComponent((location.hash.match(/c=([^&]+)/) || [])[1] || '');
    if (want) $$('[data-colour-pick]').find((b) => b.dataset.colourPick === want)?.click();
    $$('[data-size-pick]').forEach((b) => b.addEventListener('click', () => {
      size = b.dataset.sizePick; $$('[data-size-pick]').forEach((x) => x.classList.toggle('is-on', x === b));
    }));
    const qIn = $('[data-qty] input');
    $$('[data-qty] [data-step]').forEach((b) => b.addEventListener('click', () => { qIn.value = Math.min(20, Math.max(1, (+qIn.value || 1) + +b.dataset.step)); }));
    $('[data-add]')?.addEventListener('click', () => {
      if (!size) { toast('Please choose your size first'); $('[data-size-pick]')?.focus(); return; }
      const c = P.colours.find((x) => x.name === colour) || P.colours[0];
      addLine({ slug: P.slug, name: P.name, price: P.price, colour: c.name, size, qty: Math.max(1, +qIn.value || 1), img: c.img });
      openBasket();
    });
    $$('[data-wa-order]').forEach((a) => a.addEventListener('click', (e) => {
      if (!size) { e.preventDefault(); toast('Please choose your size first'); return; }
      a.href = waLink(`Hi! I'd like to pre-order the ${P.name} in ${colour}, size ${size} (x${Math.max(1, +qIn.value || 1)}).`);
    }));
  }

  // basket
  const KEY = 'bff-basket';
  let lines = store.get(KEY, []);
  const drawer = $('[data-drawer]'), scrim = $('.scrim');
  const money = (n) => `${n.toFixed(2)} ${CFG.currency}`;
  const save = () => { store.set(KEY, lines); render(); };
  function addLine(l) {
    const same = lines.find((x) => x.slug === l.slug && x.colour === l.colour && x.size === l.size);
    if (same) same.qty = Math.min(20, same.qty + l.qty); else lines.push(l);
    save(); toast(`${l.name} added to your basket`);
  }
  function render() {
    const n = lines.reduce((a, l) => a + l.qty, 0);
    $$('[data-basket-count]').forEach((e) => { e.textContent = n; e.hidden = !n; });
    if (!drawer) return;
    $('[data-basket-empty]', drawer).hidden = !!n;
    $('[data-checkout]', drawer).hidden = !n;
    $('[data-basket-lines]', drawer).innerHTML = lines.map((l, i) => `
      <li class="line"><img src="${escH(l.img)}" alt="" width="72" height="96">
        <div><p class="line__name">${escH(l.name)}</p><p class="small">${escH(l.colour)} · Size ${escH(l.size)}</p>
          <p class="small">${l.price ? money(l.price * l.qty) : 'Pre-order · price coming soon'}</p>
          <div class="qty qty--sm"><button type="button" data-line="${i}" data-d="-1" aria-label="Less">−</button><span>${l.qty}</span><button type="button" data-line="${i}" data-d="1" aria-label="More">+</button></div></div>
        <button class="line__x" type="button" data-remove="${i}" aria-label="Remove ${escH(l.name)}">×</button></li>`).join('');
    const priced = lines.every((l) => l.price);
    $('[data-basket-total]', drawer).textContent = priced ? money(lines.reduce((a, l) => a + l.price * l.qty, 0)) : 'Confirmed on order';
  }
  drawer?.addEventListener('click', (e) => {
    const d = e.target.closest('[data-d]'), x = e.target.closest('[data-remove]');
    if (d) { const l = lines[+d.dataset.line]; l.qty += +d.dataset.d; if (l.qty < 1) lines.splice(+d.dataset.line, 1); save(); }
    if (x) { lines.splice(+x.dataset.remove, 1); save(); }
  });
  function openBasket() { if (!drawer) return; scrim.hidden = false; requestAnimationFrame(() => { drawer.classList.add('is-open'); scrim.classList.add('is-on'); }); drawer.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; $('.drawer__x', drawer).focus(); }
  function closeBasket() { if (!drawer) return; drawer.classList.remove('is-open'); scrim.classList.remove('is-on'); drawer.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; setTimeout(() => (scrim.hidden = true), 350); }
  $$('[data-basket-open]').forEach((b) => b.addEventListener('click', openBasket));
  $$('[data-basket-close]').forEach((b) => b.addEventListener('click', closeBasket));
  addEventListener('keydown', (e) => { if (e.key !== 'Escape') return; if (drawer?.classList.contains('is-open')) closeBasket(); else if (nav?.classList.contains('is-open')) setNav(false); });
  render();

  // pre-order checkout
  $('[data-checkout]')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.target));
    const items = lines.map((l) => `• ${l.name} — ${l.colour}, size ${l.size} × ${l.qty}`).join('\n');
    const text = `New Be Fit & Flex PRE-ORDER\n\n${items}\n\nName: ${f.name}\nEmail: ${f.email}\nPhone: ${f.phone}\nCity: ${f.city || '-'}\nPayment: ${f.payment}\nNewsletter: ${f.subscribe ? 'Yes' : 'No'}\nNotes: ${f.notes || '-'}`;
    const ok = await send({ type: 'pre-order', ...f, items: lines });
    if (!ok) window.open(waLink(text), '_blank', 'noopener');
    lines = []; save(); e.target.reset(); closeBasket();
    toast(ok ? 'Thank you! Your pre-order is in — we will be in touch shortly.' : 'Almost done — press send in WhatsApp to place your pre-order.');
  });

  // email subscriptions
  $$('[data-news]').forEach((f) => f.addEventListener('submit', async (e) => {
    e.preventDefault();
    const em = $('input', f).value;
    if (await send({ type: 'newsletter', email: em })) { f.reset(); toast("You're on the list! Welcome to Be Fit & Flex."); return; }
    location.href = `mailto:${CFG.email}?subject=${encodeURIComponent('Subscribe me to Be Fit & Flex')}&body=${encodeURIComponent('Please add me to the Be Fit & Flex list: ' + em)}`;
    toast('Almost done — just press send in your email app.');
  }));
})();
